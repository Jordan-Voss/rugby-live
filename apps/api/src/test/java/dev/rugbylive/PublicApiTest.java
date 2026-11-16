package dev.rugbylive;
import static org.assertj.core.api.Assertions.*;
import java.net.URI;
import java.net.http.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.databind.ObjectMapper;
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
class PublicApiTest {
 @LocalServerPort int port;
 final HttpClient client=HttpClient.newHttpClient();
 HttpResponse<String> get(String path)throws Exception{return client.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+"/api/v1"+path)).build(),HttpResponse.BodyHandlers.ofString());}
 @Test void sampleDataIsExplicitAndZeroIsPreserved()throws Exception{var r=get("/bootstrap");assertThat(r.statusCode()).isEqualTo(200);var data=new ObjectMapper().readTree(r.body());assertThat(data.path("mode").asText()).isEqualTo("sample");assertThat(data.path("matches").size()).isEqualTo(8);assertThat(data.path("players").get(0).path("stats").path("tries").asInt()).isZero();}
 @Test void datesAreValidated()throws Exception{assertThat(get("/matches?date=bad").statusCode()).isEqualTo(400);assertThat(get("/matches?date=2026-11-14").statusCode()).isEqualTo(200);}
 @Test void missingMatchesAreNotInvented()throws Exception{assertThat(get("/matches/missing").statusCode()).isEqualTo(404);assertThat(get("/matches?date=2026-01-01").body()).isEqualTo("[]");}
 @Test void accountsFailClosed()throws Exception{assertThat(get("/favourites").statusCode()).isEqualTo(503);assertThat(get("/config").body()).contains("\"accountsAvailable\":false");}
 @Test void coveragePreservesUnavailableStats()throws Exception{var data=new ObjectMapper().readTree(get("/matches/gla-edi-demo").body());assertThat(data.path("stats").isNull()).isTrue();assertThat(data.path("coverage").asText()).isEqualTo("scores");}
}
