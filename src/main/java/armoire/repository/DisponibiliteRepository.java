package armoire.repository;

import armoire.domain.Disponibilite;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Disponibilite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, Long> {}
