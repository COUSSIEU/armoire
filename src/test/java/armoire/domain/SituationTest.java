package armoire.domain;

import static org.assertj.core.api.Assertions.assertThat;

import armoire.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SituationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Situation.class);
        Situation situation1 = new Situation();
        situation1.setId(1L);
        Situation situation2 = new Situation();
        situation2.setId(situation1.getId());
        assertThat(situation1).isEqualTo(situation2);
        situation2.setId(2L);
        assertThat(situation1).isNotEqualTo(situation2);
        situation1.setId(null);
        assertThat(situation1).isNotEqualTo(situation2);
    }
}
