package armoire.domain;

import armoire.domain.enumeration.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Une disponibilité décrit l'état d'un composant d'armoire à un instant donné.
 */
@Schema(description = "Une disponibilité décrit l'état d'un composant d'armoire à un instant donné.")
@Entity
@Table(name = "disponibilite")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Disponibilite implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "observable", nullable = false)
    private String observable;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "etat", nullable = false)
    private Status etat;

    @Column(name = "remarques")
    private String remarques;

    @ManyToOne
    @JsonIgnoreProperties(value = { "versions", "utilisations", "disponibilites" }, allowSetters = true)
    private Situation situation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Disponibilite id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Disponibilite nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getObservable() {
        return this.observable;
    }

    public Disponibilite observable(String observable) {
        this.setObservable(observable);
        return this;
    }

    public void setObservable(String observable) {
        this.observable = observable;
    }

    public Status getEtat() {
        return this.etat;
    }

    public Disponibilite etat(Status etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Status etat) {
        this.etat = etat;
    }

    public String getRemarques() {
        return this.remarques;
    }

    public Disponibilite remarques(String remarques) {
        this.setRemarques(remarques);
        return this;
    }

    public void setRemarques(String remarques) {
        this.remarques = remarques;
    }

    public Situation getSituation() {
        return this.situation;
    }

    public void setSituation(Situation situation) {
        this.situation = situation;
    }

    public Disponibilite situation(Situation situation) {
        this.setSituation(situation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Disponibilite)) {
            return false;
        }
        return id != null && id.equals(((Disponibilite) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Disponibilite{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", observable='" + getObservable() + "'" +
            ", etat='" + getEtat() + "'" +
            ", remarques='" + getRemarques() + "'" +
            "}";
    }
}
