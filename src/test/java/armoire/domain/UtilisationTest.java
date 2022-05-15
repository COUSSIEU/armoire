package armoire.domain;

import static org.assertj.core.api.Assertions.assertThat;

import armoire.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UtilisationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Utilisation.class);
        Utilisation utilisation1 = new Utilisation();
        utilisation1.setId(1L);
        Utilisation utilisation2 = new Utilisation();
        utilisation2.setId(utilisation1.getId());
        assertThat(utilisation1).isEqualTo(utilisation2);
        utilisation2.setId(2L);
        assertThat(utilisation1).isNotEqualTo(utilisation2);
        utilisation1.setId(null);
        assertThat(utilisation1).isNotEqualTo(utilisation2);
    }
}
