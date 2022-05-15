package armoire.repository;

import armoire.domain.Situation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Situation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SituationRepository extends JpaRepository<Situation, Long> {}
