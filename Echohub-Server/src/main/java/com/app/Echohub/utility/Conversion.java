//package com.app.Echohub.utility;
//
//public class Conversion {
//    public static double convertToMilliseconds(String timeString) {
//
//        String[] parts = timeString.split(" ");
//        double time = Double.parseDouble(parts[0]);
//        String unit = parts[1].toLowerCase();
//        System.out.println("time string :"+timeString);
//        switch (unit) {
//            case "day":
//            case "days":
//                return time * 24 * 60 * 60 * 1000;
//            case "hour":
//            case "hours":
//                return time * 60 * 60 * 1000;
//            case "minute":
//            case "minutes":
//                return time * 60 * 1000;
//            case "second":
//            case "seconds":
//                return time * 1000;
//            default:
//                return time;
//        }
//    }
//}
