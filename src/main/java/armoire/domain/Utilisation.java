package armoire.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Utilisation.
 */
@Schema(description = "A Utilisation.")
@Entity
@Table(name = "utilisation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Utilisation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "element", nullable = false)
    private String element;

    @NotNull
    @Column(name = "etat", nullable = false)
    private String etat;

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

    public Utilisation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getElement() {
        return this.element;
    }

    public Utilisation element(String element) {
        this.setElement(element);
        return this;
    }

    public void setElement(String element) {
        this.element = element;
    }

    public String getEtat() {
        return this.etat;
    }

    public Utilisation etat(String etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public Long getNombre() {
        return this.nombre;
    }

    public Utilisation nombre(Long nombre) {
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

    public Utilisation situation(Situation situation) {
        this.setSituation(situation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Utilisation)) {
            return false;
        }
        return id != null && id.equals(((Utilisation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Utilisation{" +
            "id=" + getId() +
            ", element='" + getElement() + "'" +
            ", etat='" + getEtat() + "'" +
            ", nombre=" + getNombre() +
            "}";
    }
}
