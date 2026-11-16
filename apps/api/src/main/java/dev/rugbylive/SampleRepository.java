package dev.rugbylive;
import java.io.IOException;
import java.util.stream.StreamSupport;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
@Repository
public class SampleRepository {
 private final ObjectMapper mapper = new ObjectMapper();
 private final JsonNode data;
 public SampleRepository() throws IOException { try(var in=new ClassPathResource("demo-data.json").getInputStream()){data=mapper.readTree(in);} }
 public JsonNode bootstrap(){ return data.deepCopy(); }
 public JsonNode list(String type){return data.get(type).deepCopy();}
 public JsonNode find(String type,String id){return StreamSupport.stream(data.get(type).spliterator(),false).filter(n->id.equals(n.path("id").asText())).findFirst().map(JsonNode::deepCopy).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found"));}
 public JsonNode matches(String date,String team,String competition){
  ArrayNode out=mapper.createArrayNode();
  for(JsonNode m:data.get("matches"))if((date==null||date.equals(m.path("date").asText()))&&(team==null||team.equals(m.path("homeId").asText())||team.equals(m.path("awayId").asText()))&&(competition==null||competition.equals(m.path("competitionId").asText())))out.add(m.deepCopy());
  return out;
 }
}
