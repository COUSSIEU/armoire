package armoire.domain;

import static org.assertj.core.api.Assertions.assertThat;

import armoire.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DisponibiliteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Disponibilite.class);
        Disponibilite disponibilite1 = new Disponibilite();
        disponibilite1.setId(1L);
        Disponibilite disponibilite2 = new Disponibilite();
        disponibilite2.setId(disponibilite1.getId());
        assertThat(disponibilite1).isEqualTo(disponibilite2);
        disponibilite2.setId(2L);
        assertThat(disponibilite1).isNotEqualTo(disponibilite2);
        disponibilite1.setId(null);
        assertThat(disponibilite1).isNotEqualTo(disponibilite2);
    }
}
