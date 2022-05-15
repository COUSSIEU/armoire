package armoire.web.rest;

import armoire.domain.Disponibilite;
import armoire.repository.DisponibiliteRepository;
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
 * REST controller for managing {@link armoire.domain.Disponibilite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DisponibiliteResource {

    private final Logger log = LoggerFactory.getLogger(DisponibiliteResource.class);

    private static final String ENTITY_NAME = "disponibilite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DisponibiliteRepository disponibiliteRepository;

    public DisponibiliteResource(DisponibiliteRepository disponibiliteRepository) {
        this.disponibiliteRepository = disponibiliteRepository;
    }

    /**
     * {@code POST  /disponibilites} : Create a new disponibilite.
     *
     * @param disponibilite the disponibilite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new disponibilite, or with status {@code 400 (Bad Request)} if the disponibilite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/disponibilites")
    public ResponseEntity<Disponibilite> createDisponibilite(@Valid @RequestBody Disponibilite disponibilite) throws URISyntaxException {
        log.debug("REST request to save Disponibilite : {}", disponibilite);
        if (disponibilite.getId() != null) {
            throw new BadRequestAlertException("A new disponibilite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Disponibilite result = disponibiliteRepository.save(disponibilite);
        return ResponseEntity
            .created(new URI("/api/disponibilites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /disponibilites/:id} : Updates an existing disponibilite.
     *
     * @param id the id of the disponibilite to save.
     * @param disponibilite the disponibilite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated disponibilite,
     * or with status {@code 400 (Bad Request)} if the disponibilite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the disponibilite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/disponibilites/{id}")
    public ResponseEntity<Disponibilite> updateDisponibilite(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Disponibilite disponibilite
    ) throws URISyntaxException {
        log.debug("REST request to update Disponibilite : {}, {}", id, disponibilite);
        if (disponibilite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, disponibilite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!disponibiliteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Disponibilite result = disponibiliteRepository.save(disponibilite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, disponibilite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /disponibilites/:id} : Partial updates given fields of an existing disponibilite, field will ignore if it is null
     *
     * @param id the id of the disponibilite to save.
     * @param disponibilite the disponibilite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated disponibilite,
     * or with status {@code 400 (Bad Request)} if the disponibilite is not valid,
     * or with status {@code 404 (Not Found)} if the disponibilite is not found,
     * or with status {@code 500 (Internal Server Error)} if the disponibilite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/disponibilites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Disponibilite> partialUpdateDisponibilite(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Disponibilite disponibilite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Disponibilite partially : {}, {}", id, disponibilite);
        if (disponibilite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, disponibilite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!disponibiliteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Disponibilite> result = disponibiliteRepository
            .findById(disponibilite.getId())
            .map(existingDisponibilite -> {
                if (disponibilite.getNom() != null) {
                    existingDisponibilite.setNom(disponibilite.getNom());
                }
                if (disponibilite.getObservable() != null) {
                    existingDisponibilite.setObservable(disponibilite.getObservable());
                }
                if (disponibilite.getEtat() != null) {
                    existingDisponibilite.setEtat(disponibilite.getEtat());
                }
                if (disponibilite.getRemarques() != null) {
                    existingDisponibilite.setRemarques(disponibilite.getRemarques());
                }

                return existingDisponibilite;
            })
            .map(disponibiliteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, disponibilite.getId().toString())
        );
    }

    /**
     * {@code GET  /disponibilites} : get all the disponibilites.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of disponibilites in body.
     */
    @GetMapping("/disponibilites")
    public List<Disponibilite> getAllDisponibilites() {
        log.debug("REST request to get all Disponibilites");
        return disponibiliteRepository.findAll();
    }

    /**
     * {@code GET  /disponibilites/:id} : get the "id" disponibilite.
     *
     * @param id the id of the disponibilite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the disponibilite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/disponibilites/{id}")
    public ResponseEntity<Disponibilite> getDisponibilite(@PathVariable Long id) {
        log.debug("REST request to get Disponibilite : {}", id);
        Optional<Disponibilite> disponibilite = disponibiliteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(disponibilite);
    }

    /**
     * {@code DELETE  /disponibilites/:id} : delete the "id" disponibilite.
     *
     * @param id the id of the disponibilite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/disponibilites/{id}")
    public ResponseEntity<Void> deleteDisponibilite(@PathVariable Long id) {
        log.debug("REST request to delete Disponibilite : {}", id);
        disponibiliteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
