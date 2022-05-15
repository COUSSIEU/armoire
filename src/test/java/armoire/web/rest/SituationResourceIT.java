package armoire.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import armoire.IntegrationTest;
import armoire.domain.Situation;
import armoire.repository.SituationRepository;
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
 * Integration tests for the {@link SituationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SituationResourceIT {

    private static final String DEFAULT_CREATION = "AAAAAAAAAA";
    private static final String UPDATED_CREATION = "BBBBBBBBBB";

    private static final String DEFAULT_EMISSION = "AAAAAAAAAA";
    private static final String UPDATED_EMISSION = "BBBBBBBBBB";

    private static final String DEFAULT_SECOND_DATE = "AAAAAAAAAA";
    private static final String UPDATED_SECOND_DATE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/situations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SituationRepository situationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSituationMockMvc;

    private Situation situation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Situation createEntity(EntityManager em) {
        Situation situation = new Situation().creation(DEFAULT_CREATION).emission(DEFAULT_EMISSION).secondDate(DEFAULT_SECOND_DATE);
        return situation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Situation createUpdatedEntity(EntityManager em) {
        Situation situation = new Situation().creation(UPDATED_CREATION).emission(UPDATED_EMISSION).secondDate(UPDATED_SECOND_DATE);
        return situation;
    }

    @BeforeEach
    public void initTest() {
        situation = createEntity(em);
    }

    @Test
    @Transactional
    void createSituation() throws Exception {
        int databaseSizeBeforeCreate = situationRepository.findAll().size();
        // Create the Situation
        restSituationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(situation)))
            .andExpect(status().isCreated());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeCreate + 1);
        Situation testSituation = situationList.get(situationList.size() - 1);
        assertThat(testSituation.getCreation()).isEqualTo(DEFAULT_CREATION);
        assertThat(testSituation.getEmission()).isEqualTo(DEFAULT_EMISSION);
        assertThat(testSituation.getSecondDate()).isEqualTo(DEFAULT_SECOND_DATE);
    }

    @Test
    @Transactional
    void createSituationWithExistingId() throws Exception {
        // Create the Situation with an existing ID
        situation.setId(1L);

        int databaseSizeBeforeCreate = situationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSituationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(situation)))
            .andExpect(status().isBadRequest());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreationIsRequired() throws Exception {
        int databaseSizeBeforeTest = situationRepository.findAll().size();
        // set the field null
        situation.setCreation(null);

        // Create the Situation, which fails.

        restSituationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(situation)))
            .andExpect(status().isBadRequest());

        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSituations() throws Exception {
        // Initialize the database
        situationRepository.saveAndFlush(situation);

        // Get all the situationList
        restSituationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(situation.getId().intValue())))
            .andExpect(jsonPath("$.[*].creation").value(hasItem(DEFAULT_CREATION)))
            .andExpect(jsonPath("$.[*].emission").value(hasItem(DEFAULT_EMISSION)))
            .andExpect(jsonPath("$.[*].secondDate").value(hasItem(DEFAULT_SECOND_DATE)));
    }

    @Test
    @Transactional
    void getSituation() throws Exception {
        // Initialize the database
        situationRepository.saveAndFlush(situation);

        // Get the situation
        restSituationMockMvc
            .perform(get(ENTITY_API_URL_ID, situation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(situation.getId().intValue()))
            .andExpect(jsonPath("$.creation").value(DEFAULT_CREATION))
            .andExpect(jsonPath("$.emission").value(DEFAULT_EMISSION))
            .andExpect(jsonPath("$.secondDate").value(DEFAULT_SECOND_DATE));
    }

    @Test
    @Transactional
    void getNonExistingSituation() throws Exception {
        // Get the situation
        restSituationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSituation() throws Exception {
        // Initialize the database
        situationRepository.saveAndFlush(situation);

        int databaseSizeBeforeUpdate = situationRepository.findAll().size();

        // Update the situation
        Situation updatedSituation = situationRepository.findById(situation.getId()).get();
        // Disconnect from session so that the updates on updatedSituation are not directly saved in db
        em.detach(updatedSituation);
        updatedSituation.creation(UPDATED_CREATION).emission(UPDATED_EMISSION).secondDate(UPDATED_SECOND_DATE);

        restSituationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSituation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSituation))
            )
            .andExpect(status().isOk());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
        Situation testSituation = situationList.get(situationList.size() - 1);
        assertThat(testSituation.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testSituation.getEmission()).isEqualTo(UPDATED_EMISSION);
        assertThat(testSituation.getSecondDate()).isEqualTo(UPDATED_SECOND_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSituation() throws Exception {
        int databaseSizeBeforeUpdate = situationRepository.findAll().size();
        situation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSituationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, situation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(situation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSituation() throws Exception {
        int databaseSizeBeforeUpdate = situationRepository.findAll().size();
        situation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSituationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(situation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSituation() throws Exception {
        int databaseSizeBeforeUpdate = situationRepository.findAll().size();
        situation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSituationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(situation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSituationWithPatch() throws Exception {
        // Initialize the database
        situationRepository.saveAndFlush(situation);

        int databaseSizeBeforeUpdate = situationRepository.findAll().size();

        // Update the situation using partial update
        Situation partialUpdatedSituation = new Situation();
        partialUpdatedSituation.setId(situation.getId());

        partialUpdatedSituation.emission(UPDATED_EMISSION).secondDate(UPDATED_SECOND_DATE);

        restSituationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSituation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSituation))
            )
            .andExpect(status().isOk());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
        Situation testSituation = situationList.get(situationList.size() - 1);
        assertThat(testSituation.getCreation()).isEqualTo(DEFAULT_CREATION);
        assertThat(testSituation.getEmission()).isEqualTo(UPDATED_EMISSION);
        assertThat(testSituation.getSecondDate()).isEqualTo(UPDATED_SECOND_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSituationWithPatch() throws Exception {
        // Initialize the database
        situationRepository.saveAndFlush(situation);

        int databaseSizeBeforeUpdate = situationRepository.findAll().size();

        // Update the situation using partial update
        Situation partialUpdatedSituation = new Situation();
        partialUpdatedSituation.setId(situation.getId());

        partialUpdatedSituation.creation(UPDATED_CREATION).emission(UPDATED_EMISSION).secondDate(UPDATED_SECOND_DATE);

        restSituationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSituation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSituation))
            )
            .andExpect(status().isOk());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
        Situation testSituation = situationList.get(situationList.size() - 1);
        assertThat(testSituation.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testSituation.getEmission()).isEqualTo(UPDATED_EMISSION);
        assertThat(testSituation.getSecondDate()).isEqualTo(UPDATED_SECOND_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSituation() throws Exception {
        int databaseSizeBeforeUpdate = situationRepository.findAll().size();
        situation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSituationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, situation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(situation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSituation() throws Exception {
        int databaseSizeBeforeUpdate = situationRepository.findAll().size();
        situation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSituationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(situation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSituation() throws Exception {
        int databaseSizeBeforeUpdate = situationRepository.findAll().size();
        situation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSituationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(situation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Situation in the database
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSituation() throws Exception {
        // Initialize the database
        situationRepository.saveAndFlush(situation);

        int databaseSizeBeforeDelete = situationRepository.findAll().size();

        // Delete the situation
        restSituationMockMvc
            .perform(delete(ENTITY_API_URL_ID, situation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Situation> situationList = situationRepository.findAll();
        assertThat(situationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
