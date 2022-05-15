package armoire.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import armoire.IntegrationTest;
import armoire.domain.Disponibilite;
import armoire.domain.enumeration.Status;
import armoire.repository.DisponibiliteRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DisponibiliteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DisponibiliteResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_OBSERVABLE = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVABLE = "BBBBBBBBBB";

    private static final Status DEFAULT_ETAT = Status.OK;
    private static final Status UPDATED_ETAT = Status.KO;

    private static final String DEFAULT_REMARQUES = "AAAAAAAAAA";
    private static final String UPDATED_REMARQUES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/disponibilites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DisponibiliteRepository disponibiliteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDisponibiliteMockMvc;

    private Disponibilite disponibilite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Disponibilite createEntity(EntityManager em) {
        Disponibilite disponibilite = new Disponibilite()
            .nom(DEFAULT_NOM)
            .observable(DEFAULT_OBSERVABLE)
            .etat(DEFAULT_ETAT)
            .remarques(DEFAULT_REMARQUES);
        return disponibilite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Disponibilite createUpdatedEntity(EntityManager em) {
        Disponibilite disponibilite = new Disponibilite()
            .nom(UPDATED_NOM)
            .observable(UPDATED_OBSERVABLE)
            .etat(UPDATED_ETAT)
            .remarques(UPDATED_REMARQUES);
        return disponibilite;
    }

    @BeforeEach
    public void initTest() {
        disponibilite = createEntity(em);
    }

    @Test
    @Transactional
    void createDisponibilite() throws Exception {
        int databaseSizeBeforeCreate = disponibiliteRepository.findAll().size();
        // Create the Disponibilite
        restDisponibiliteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disponibilite)))
            .andExpect(status().isCreated());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeCreate + 1);
        Disponibilite testDisponibilite = disponibiliteList.get(disponibiliteList.size() - 1);
        assertThat(testDisponibilite.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testDisponibilite.getObservable()).isEqualTo(DEFAULT_OBSERVABLE);
        assertThat(testDisponibilite.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testDisponibilite.getRemarques()).isEqualTo(DEFAULT_REMARQUES);
    }

    @Test
    @Transactional
    void createDisponibiliteWithExistingId() throws Exception {
        // Create the Disponibilite with an existing ID
        disponibilite.setId(1L);

        int databaseSizeBeforeCreate = disponibiliteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDisponibiliteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disponibilite)))
            .andExpect(status().isBadRequest());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = disponibiliteRepository.findAll().size();
        // set the field null
        disponibilite.setNom(null);

        // Create the Disponibilite, which fails.

        restDisponibiliteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disponibilite)))
            .andExpect(status().isBadRequest());

        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkObservableIsRequired() throws Exception {
        int databaseSizeBeforeTest = disponibiliteRepository.findAll().size();
        // set the field null
        disponibilite.setObservable(null);

        // Create the Disponibilite, which fails.

        restDisponibiliteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disponibilite)))
            .andExpect(status().isBadRequest());

        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEtatIsRequired() throws Exception {
        int databaseSizeBeforeTest = disponibiliteRepository.findAll().size();
        // set the field null
        disponibilite.setEtat(null);

        // Create the Disponibilite, which fails.

        restDisponibiliteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disponibilite)))
            .andExpect(status().isBadRequest());

        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDisponibilites() throws Exception {
        // Initialize the database
        disponibiliteRepository.saveAndFlush(disponibilite);

        // Get all the disponibiliteList
        restDisponibiliteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(disponibilite.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].observable").value(hasItem(DEFAULT_OBSERVABLE)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())))
            .andExpect(jsonPath("$.[*].remarques").value(hasItem(DEFAULT_REMARQUES)));
    }

    @Test
    @Transactional
    void getDisponibilite() throws Exception {
        // Initialize the database
        disponibiliteRepository.saveAndFlush(disponibilite);

        // Get the disponibilite
        restDisponibiliteMockMvc
            .perform(get(ENTITY_API_URL_ID, disponibilite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(disponibilite.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.observable").value(DEFAULT_OBSERVABLE))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()))
            .andExpect(jsonPath("$.remarques").value(DEFAULT_REMARQUES));
    }

    @Test
    @Transactional
    void getNonExistingDisponibilite() throws Exception {
        // Get the disponibilite
        restDisponibiliteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDisponibilite() throws Exception {
        // Initialize the database
        disponibiliteRepository.saveAndFlush(disponibilite);

        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();

        // Update the disponibilite
        Disponibilite updatedDisponibilite = disponibiliteRepository.findById(disponibilite.getId()).get();
        // Disconnect from session so that the updates on updatedDisponibilite are not directly saved in db
        em.detach(updatedDisponibilite);
        updatedDisponibilite.nom(UPDATED_NOM).observable(UPDATED_OBSERVABLE).etat(UPDATED_ETAT).remarques(UPDATED_REMARQUES);

        restDisponibiliteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDisponibilite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDisponibilite))
            )
            .andExpect(status().isOk());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
        Disponibilite testDisponibilite = disponibiliteList.get(disponibiliteList.size() - 1);
        assertThat(testDisponibilite.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDisponibilite.getObservable()).isEqualTo(UPDATED_OBSERVABLE);
        assertThat(testDisponibilite.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testDisponibilite.getRemarques()).isEqualTo(UPDATED_REMARQUES);
    }

    @Test
    @Transactional
    void putNonExistingDisponibilite() throws Exception {
        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();
        disponibilite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDisponibiliteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, disponibilite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(disponibilite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDisponibilite() throws Exception {
        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();
        disponibilite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisponibiliteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(disponibilite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDisponibilite() throws Exception {
        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();
        disponibilite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisponibiliteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(disponibilite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDisponibiliteWithPatch() throws Exception {
        // Initialize the database
        disponibiliteRepository.saveAndFlush(disponibilite);

        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();

        // Update the disponibilite using partial update
        Disponibilite partialUpdatedDisponibilite = new Disponibilite();
        partialUpdatedDisponibilite.setId(disponibilite.getId());

        partialUpdatedDisponibilite.observable(UPDATED_OBSERVABLE).remarques(UPDATED_REMARQUES);

        restDisponibiliteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDisponibilite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDisponibilite))
            )
            .andExpect(status().isOk());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
        Disponibilite testDisponibilite = disponibiliteList.get(disponibiliteList.size() - 1);
        assertThat(testDisponibilite.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testDisponibilite.getObservable()).isEqualTo(UPDATED_OBSERVABLE);
        assertThat(testDisponibilite.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testDisponibilite.getRemarques()).isEqualTo(UPDATED_REMARQUES);
    }

    @Test
    @Transactional
    void fullUpdateDisponibiliteWithPatch() throws Exception {
        // Initialize the database
        disponibiliteRepository.saveAndFlush(disponibilite);

        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();

        // Update the disponibilite using partial update
        Disponibilite partialUpdatedDisponibilite = new Disponibilite();
        partialUpdatedDisponibilite.setId(disponibilite.getId());

        partialUpdatedDisponibilite.nom(UPDATED_NOM).observable(UPDATED_OBSERVABLE).etat(UPDATED_ETAT).remarques(UPDATED_REMARQUES);

        restDisponibiliteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDisponibilite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDisponibilite))
            )
            .andExpect(status().isOk());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
        Disponibilite testDisponibilite = disponibiliteList.get(disponibiliteList.size() - 1);
        assertThat(testDisponibilite.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDisponibilite.getObservable()).isEqualTo(UPDATED_OBSERVABLE);
        assertThat(testDisponibilite.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testDisponibilite.getRemarques()).isEqualTo(UPDATED_REMARQUES);
    }

    @Test
    @Transactional
    void patchNonExistingDisponibilite() throws Exception {
        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();
        disponibilite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDisponibiliteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, disponibilite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(disponibilite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDisponibilite() throws Exception {
        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();
        disponibilite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisponibiliteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(disponibilite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDisponibilite() throws Exception {
        int databaseSizeBeforeUpdate = disponibiliteRepository.findAll().size();
        disponibilite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDisponibiliteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(disponibilite))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Disponibilite in the database
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDisponibilite() throws Exception {
        // Initialize the database
        disponibiliteRepository.saveAndFlush(disponibilite);

        int databaseSizeBeforeDelete = disponibiliteRepository.findAll().size();

        // Delete the disponibilite
        restDisponibiliteMockMvc
            .perform(delete(ENTITY_API_URL_ID, disponibilite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Disponibilite> disponibiliteList = disponibiliteRepository.findAll();
        assertThat(disponibiliteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
