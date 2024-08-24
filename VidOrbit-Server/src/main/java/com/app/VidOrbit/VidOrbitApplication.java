package com.app.VidOrbit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import ws.schild.jave.process.ffmpeg.DefaultFFMPEGLocator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@SpringBootApplication
@EnableCaching
@EnableAsync
public class VidOrbitApplication {

	public static void main(String[] args) {
		SpringApplication.run(VidOrbitApplication.class, args);


//		DefaultFFMPEGLocator locator=new DefaultFFMPEGLocator();
//		String command = locator.getExecutablePath()+" -version";
////		String command = "ffmpeg -version";
//		ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
//		try {
//			Process process = processBuilder.start();
//			printProcessOutput(process);
//			process.waitFor();
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
    }

//	private static void printProcessOutput(Process process) throws IOException {
//		System.out.println("------------------------------------------------------------------------");
//		try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
//			String line;
//			while ((line = reader.readLine()) != null) {
//				System.out.println(line);
//			}
//		}
//		try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
//			String line;
//			while ((line = errorReader.readLine()) != null) {
//				System.err.println(line);
//			}
//		}
//	}

}
