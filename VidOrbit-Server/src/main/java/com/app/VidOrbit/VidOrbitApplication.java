package com.app.VidOrbit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class VidOrbitApplication {

	public static void main(String[] args) {
		SpringApplication.run(VidOrbitApplication.class, args);
	}

}
