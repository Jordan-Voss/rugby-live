package dev.rugbylive;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class ApiConfiguration implements WebMvcConfigurer {
 @Value("${CORS_ORIGINS:http://localhost:5173,http://127.0.0.1:5173,capacitor://localhost,https://localhost}") private String origins;
 @Override public void addCorsMappings(CorsRegistry registry){registry.addMapping("/api/**").allowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).toArray(String[]::new)).allowedMethods("GET").maxAge(3600);}
}
