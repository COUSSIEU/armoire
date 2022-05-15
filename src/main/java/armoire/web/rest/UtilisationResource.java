package armoire.web.rest;

import armoire.domain.Utilisation;
import armoire.repository.UtilisationRepository;
import armoire.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link armoire.domain.Utilisation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UtilisationResource {

    private final Logger log = LoggerFactory.getLogger(UtilisationResource.class);

    private static final String ENTITY_NAME = "utilisation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UtilisationRepository utilisationRepository;

    public UtilisationResource(UtilisationRepository utilisationRepository) {
        this.utilisationRepository = utilisationRepository;
    }

    /**
     * {@code POST  /utilisations} : Create a new utilisation.
     *
     * @param utilisation the utilisation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new utilisation, or with status {@code 400 (Bad Request)} if the utilisation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/utilisations")
    public ResponseEntity<Utilisation> createUtilisation(@Valid @RequestBody Utilisation utilisation) throws URISyntaxException {
        log.debug("REST request to save Utilisation : {}", utilisation);
        if (utilisation.getId() != null) {
            throw new BadRequestAlertException("A new utilisation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Utilisation result = utilisationRepository.save(utilisation);
        return ResponseEntity
            .created(new URI("/api/utilisations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /utilisations/:id} : Updates an existing utilisation.
     *
     * @param id the id of the utilisation to save.
     * @param utilisation the utilisation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated utilisation,
     * or with status {@code 400 (Bad Request)} if the utilisation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the utilisation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/utilisations/{id}")
    public ResponseEntity<Utilisation> updateUtilisation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Utilisation utilisation
    ) throws URISyntaxException {
        log.debug("REST request to update Utilisation : {}, {}", id, utilisation);
        if (utilisation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, utilisation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!utilisationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Utilisation result = utilisationRepository.save(utilisation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, utilisation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /utilisations/:id} : Partial updates given fields of an existing utilisation, field will ignore if it is null
     *
     * @param id the id of the utilisation to save.
     * @param utilisation the utilisation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated utilisation,
     * or with status {@code 400 (Bad Request)} if the utilisation is not valid,
     * or with status {@code 404 (Not Found)} if the utilisation is not found,
     * or with status {@code 500 (Internal Server Error)} if the utilisation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/utilisations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Utilisation> partialUpdateUtilisation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Utilisation utilisation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Utilisation partially : {}, {}", id, utilisation);
        if (utilisation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, utilisation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!utilisationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Utilisation> result = utilisationRepository
            .findById(utilisation.getId())
            .map(existingUtilisation -> {
                if (utilisation.getElement() != null) {
                    existingUtilisation.setElement(utilisation.getElement());
                }
                if (utilisation.getEtat() != null) {
                    existingUtilisation.setEtat(utilisation.getEtat());
                }
                if (utilisation.getNombre() != null) {
                    existingUtilisation.setNombre(utilisation.getNombre());
                }

                return existingUtilisation;
            })
            .map(utilisationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, utilisation.getId().toString())
        );
    }

    /**
     * {@code GET  /utilisations} : get all the utilisations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of utilisations in body.
     */
    @GetMapping("/utilisations")
    public List<Utilisation> getAllUtilisations() {
        log.debug("REST request to get all Utilisations");
        return utilisationRepository.findAll();
    }

    /**
     * {@code GET  /utilisations/:id} : get the "id" utilisation.
     *
     * @param id the id of the utilisation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the utilisation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/utilisations/{id}")
    public ResponseEntity<Utilisation> getUtilisation(@PathVariable Long id) {
        log.debug("REST request to get Utilisation : {}", id);
        Optional<Utilisation> utilisation = utilisationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(utilisation);
    }

    /**
     * {@code DELETE  /utilisations/:id} : delete the "id" utilisation.
     *
     * @param id the id of the utilisation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/utilisations/{id}")
    public ResponseEntity<Void> deleteUtilisation(@PathVariable Long id) {
        log.debug("REST request to delete Utilisation : {}", id);
        utilisationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
