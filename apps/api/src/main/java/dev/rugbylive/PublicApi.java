package dev.rugbylive;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;
@RestController
@RequestMapping("/api/v1")
public class PublicApi {
 private final SampleRepository repository;
 public PublicApi(SampleRepository repository){this.repository=repository;}
 @GetMapping("/health") public Map<String,Object> health(){return Map.of("status","UP","mode","sample","providerCalls",0);}
 @GetMapping("/config") public Map<String,Object> config(){return Map.of("mode","sample","accountsAvailable",false,"liveDataConnected",false,"notificationsAvailable",false,"defaultDate","2026-11-14");}
 @GetMapping("/bootstrap") public JsonNode bootstrap(){return repository.bootstrap();}
 @GetMapping("/matches") public JsonNode matches(@RequestParam(required=false) String date,@RequestParam(required=false) String team,@RequestParam(required=false) String competition){
  if(date!=null)try{LocalDate.parse(date);}catch(DateTimeParseException e){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Use YYYY-MM-DD");}
  return repository.matches(date,team,competition);
 }
 @GetMapping("/matches/{id}") public JsonNode match(@PathVariable String id){return repository.find("matches",id);}
 @GetMapping("/teams") public JsonNode teams(){return repository.list("teams");}
 @GetMapping("/teams/{id}") public JsonNode team(@PathVariable String id){return repository.find("teams",id);}
 @GetMapping("/players/{id}") public JsonNode player(@PathVariable String id){return repository.find("players",id);}
 @GetMapping("/competitions") public JsonNode competitions(){return repository.list("competitions");}
 @GetMapping("/competitions/{id}") public JsonNode competition(@PathVariable String id){return repository.find("competitions",id);}
 @GetMapping("/favourites") public void favourites(){throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Accounts are not configured");}
}
