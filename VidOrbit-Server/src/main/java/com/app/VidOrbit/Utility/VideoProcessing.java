package com.app.VidOrbit.Utility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.scheduling.annotation.Async;
import ws.schild.jave.process.ffmpeg.DefaultFFMPEGLocator;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class VideoProcessing {

    private static final String FFMPEG_PATH = new DefaultFFMPEGLocator().getExecutablePath();

    @Async
    public static void processVideo(String inputFileName) {
        try {
            File inputFile = new ClassPathResource("videos" + File.separator + inputFileName).getFile();
            String fname = inputFile.getName();
            fname = fname.substring(0, fname.lastIndexOf('.'));
            File basedir= new ClassPathResource("static"+ File.separator + "stream" + File.separator).getFile();
            File outputDir = new File(basedir,fname+File.separator);
            System.out.println("started");
            if (!outputDir.exists()) {
                System.out.println("not exsists creating that");
                outputDir.mkdirs();
            }
            renderAudio(inputFile, outputDir, fname, 128);
            renderAudio(inputFile, outputDir, fname, 64);
            renderVideo(inputFile, outputDir, fname, 16000, 2160);
            renderVideo(inputFile, outputDir, fname, 8000, 1440);
            renderVideo(inputFile, outputDir, fname, 5000, 1080);
            renderVideo(inputFile, outputDir, fname, 2800, 720);
            renderVideo(inputFile, outputDir, fname, 1400, 480);
            renderVideo(inputFile, outputDir, fname, 700, 360);
            renderVideo(inputFile, outputDir, fname, 400, 240);
            renderVideo(inputFile, outputDir, fname, 200, 144);
            System.out.println("rendering complted");
            packageToMpegDash(outputDir, fname);
            System.out.println("package to mpeg dash");
//            cleanupFiles(outputDir, fname);
//            System.out.println("cleanup");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private static void renderAudio(File inputFile, File outputDir, String fname, int bitrate) throws IOException {
        String outputFilePath = outputDir.getAbsolutePath() + File.separator + fname + "_audio_" + bitrate + ".m4a";
        if (!new File(outputFilePath).exists()) {
            String command = String.format("\"%s\" -y -i \"%s\" -c:a aac -b:a %dk -vn \"%s\"",
                    FFMPEG_PATH, inputFile.getAbsolutePath(), bitrate, outputFilePath);
            executeCommand(command);
        }
    }

    private static void renderVideo(File inputFile, File outputDir, String fname, int bitrate, int resolution) throws IOException {
        String outputFilePath = outputDir.getAbsolutePath() + File.separator + fname + "_" + resolution + "_" + bitrate + ".mp4";
        if (!new File(outputFilePath).exists()) {
            String command = String.format("\"%s\" -y -i \"%s\" -an -c:v libx264 -keyint_min 25 -g 25 -b:v %dk -vf scale=-2:%d -movflags frag_keyframe+empty_moov -f mp4 \"%s\"",
                    FFMPEG_PATH, inputFile.getAbsolutePath(), bitrate, resolution, outputFilePath);
            executeCommand(command);
        }
    }

    private static void packageToMpegDash(File outputDir, String fname) throws IOException {
        List<String> inputs = new ArrayList<>();
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_2160_16000.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_1440_8000.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_1080_5000.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_720_2800.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_480_1400.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_360_700.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_240_400.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_144_200.mp4");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_audio_128.m4a");
        inputs.add(outputDir.getAbsolutePath() + "/" + fname + "_audio_64.m4a");
        String outputMpdFilePath = outputDir.getAbsolutePath() + "/" + fname + "_mp4.mpd";
        System.out.println("outputMpdFilePath = " + outputMpdFilePath);
        StringBuilder commandBuilder = new StringBuilder();
        commandBuilder.append(FFMPEG_PATH);
        commandBuilder.append(" -y");
        for (String input : inputs) {
            commandBuilder.append(" -i \"").append(input).append("\"");
        }
        commandBuilder.append(" -f dash");
        commandBuilder.append(" -adaptation_sets \"id=0,streams=v id=1,streams=a\"");
        commandBuilder.append(" -seg_duration 1");
        commandBuilder.append(" -init_seg_name init_$RepresentationID$.m4s");
        commandBuilder.append(" -media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s");
        commandBuilder.append(" -use_template 1 -use_timeline 1");
        commandBuilder.append(" \"").append(outputMpdFilePath).append("\"");
        executeCommand(commandBuilder.toString());
    }

    private static void cleanupFiles(File outputDir, String fname) {
        String[] extensions = {"_2160_16000.mp4", "_1440_8000.mp4", "_1080_5000.mp4", "_720_2800.mp4",
                "_480_1400.mp4", "_360_700.mp4", "_240_400.mp4", "_144_200.mp4",
                "_audio_128.m4a", "_audio_64.m4a"};
        for (String ext : extensions) {
            new File(outputDir, fname + ext).delete();
        }
    }

    private static void executeCommand(String command) throws IOException {
        List<String> commandList = new ArrayList<>(Arrays.asList(command.split(" (?=([^\"]*\"[^\"]*\")*[^\"]*$)")));
        System.out.println("Executing command: " + String.join(" ", commandList));
        ProcessBuilder processBuilder = new ProcessBuilder(commandList);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        try (var reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
        try {
            process.waitFor();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Process was interrupted.", e);
        }
    }

}
