package armoire.domain;

import armoire.domain.enumeration.Appareil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Version.
 */
@Schema(description = "A Version.")
@Entity
@Table(name = "version")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Version implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "appareil", nullable = false)
    private Appareil appareil;

    @NotNull
    @Column(name = "version", nullable = false)
    private String version;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private Long nombre;

    @ManyToOne
    @JsonIgnoreProperties(value = { "versions", "utilisations", "disponibilites" }, allowSetters = true)
    private Situation situation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Version id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Appareil getAppareil() {
        return this.appareil;
    }

    public Version appareil(Appareil appareil) {
        this.setAppareil(appareil);
        return this;
    }

    public void setAppareil(Appareil appareil) {
        this.appareil = appareil;
    }

    public String getVersion() {
        return this.version;
    }

    public Version version(String version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Long getNombre() {
        return this.nombre;
    }

    public Version nombre(Long nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(Long nombre) {
        this.nombre = nombre;
    }

    public Situation getSituation() {
        return this.situation;
    }

    public void setSituation(Situation situation) {
        this.situation = situation;
    }

    public Version situation(Situation situation) {
        this.setSituation(situation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Version)) {
            return false;
        }
        return id != null && id.equals(((Version) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Version{" +
            "id=" + getId() +
            ", appareil='" + getAppareil() + "'" +
            ", version='" + getVersion() + "'" +
            ", nombre=" + getNombre() +
            "}";
    }
}
