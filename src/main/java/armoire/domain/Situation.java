package armoire.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Situation.
 */
@Schema(description = "A Situation.")
@Entity
@Table(name = "situation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Situation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "creation", nullable = false)
    private String creation;

    @Column(name = "emission")
    private String emission;

    @Column(name = "second_date")
    private String secondDate;

    @OneToMany(mappedBy = "situation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "situation" }, allowSetters = true)
    private Set<Version> versions = new HashSet<>();

    @OneToMany(mappedBy = "situation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "situation" }, allowSetters = true)
    private Set<Utilisation> utilisations = new HashSet<>();

    @OneToMany(mappedBy = "situation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "situation" }, allowSetters = true)
    private Set<Disponibilite> disponibilites = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Situation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCreation() {
        return this.creation;
    }

    public Situation creation(String creation) {
        this.setCreation(creation);
        return this;
    }

    public void setCreation(String creation) {
        this.creation = creation;
    }

    public String getEmission() {
        return this.emission;
    }

    public Situation emission(String emission) {
        this.setEmission(emission);
        return this;
    }

    public void setEmission(String emission) {
        this.emission = emission;
    }

    public String getSecondDate() {
        return this.secondDate;
    }

    public Situation secondDate(String secondDate) {
        this.setSecondDate(secondDate);
        return this;
    }

    public void setSecondDate(String secondDate) {
        this.secondDate = secondDate;
    }

    public Set<Version> getVersions() {
        return this.versions;
    }

    public void setVersions(Set<Version> versions) {
        if (this.versions != null) {
            this.versions.forEach(i -> i.setSituation(null));
        }
        if (versions != null) {
            versions.forEach(i -> i.setSituation(this));
        }
        this.versions = versions;
    }

    public Situation versions(Set<Version> versions) {
        this.setVersions(versions);
        return this;
    }

    public Situation addVersions(Version version) {
        this.versions.add(version);
        version.setSituation(this);
        return this;
    }

    public Situation removeVersions(Version version) {
        this.versions.remove(version);
        version.setSituation(null);
        return this;
    }

    public Set<Utilisation> getUtilisations() {
        return this.utilisations;
    }

    public void setUtilisations(Set<Utilisation> utilisations) {
        if (this.utilisations != null) {
            this.utilisations.forEach(i -> i.setSituation(null));
        }
        if (utilisations != null) {
            utilisations.forEach(i -> i.setSituation(this));
        }
        this.utilisations = utilisations;
    }

    public Situation utilisations(Set<Utilisation> utilisations) {
        this.setUtilisations(utilisations);
        return this;
    }

    public Situation addUtilisations(Utilisation utilisation) {
        this.utilisations.add(utilisation);
        utilisation.setSituation(this);
        return this;
    }

    public Situation removeUtilisations(Utilisation utilisation) {
        this.utilisations.remove(utilisation);
        utilisation.setSituation(null);
        return this;
    }

    public Set<Disponibilite> getDisponibilites() {
        return this.disponibilites;
    }

    public void setDisponibilites(Set<Disponibilite> disponibilites) {
        if (this.disponibilites != null) {
            this.disponibilites.forEach(i -> i.setSituation(null));
        }
        if (disponibilites != null) {
            disponibilites.forEach(i -> i.setSituation(this));
        }
        this.disponibilites = disponibilites;
    }

    public Situation disponibilites(Set<Disponibilite> disponibilites) {
        this.setDisponibilites(disponibilites);
        return this;
    }

    public Situation addDisponibilites(Disponibilite disponibilite) {
        this.disponibilites.add(disponibilite);
        disponibilite.setSituation(this);
        return this;
    }

    public Situation removeDisponibilites(Disponibilite disponibilite) {
        this.disponibilites.remove(disponibilite);
        disponibilite.setSituation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Situation)) {
            return false;
        }
        return id != null && id.equals(((Situation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Situation{" +
            "id=" + getId() +
            ", creation='" + getCreation() + "'" +
            ", emission='" + getEmission() + "'" +
            ", secondDate='" + getSecondDate() + "'" +
            "}";
    }
}
