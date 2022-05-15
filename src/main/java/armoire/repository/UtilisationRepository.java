package armoire.repository;

import armoire.domain.Utilisation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Utilisation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UtilisationRepository extends JpaRepository<Utilisation, Long> {}
