package armoire.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import armoire.IntegrationTest;
import armoire.domain.Utilisation;
import armoire.repository.UtilisationRepository;
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
 * Integration tests for the {@link UtilisationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UtilisationResourceIT {

    private static final String DEFAULT_ELEMENT = "AAAAAAAAAA";
    private static final String UPDATED_ELEMENT = "BBBBBBBBBB";

    private static final String DEFAULT_ETAT = "AAAAAAAAAA";
    private static final String UPDATED_ETAT = "BBBBBBBBBB";

    private static final Long DEFAULT_NOMBRE = 1L;
    private static final Long UPDATED_NOMBRE = 2L;

    private static final String ENTITY_API_URL = "/api/utilisations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UtilisationRepository utilisationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUtilisationMockMvc;

    private Utilisation utilisation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Utilisation createEntity(EntityManager em) {
        Utilisation utilisation = new Utilisation().element(DEFAULT_ELEMENT).etat(DEFAULT_ETAT).nombre(DEFAULT_NOMBRE);
        return utilisation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Utilisation createUpdatedEntity(EntityManager em) {
        Utilisation utilisation = new Utilisation().element(UPDATED_ELEMENT).etat(UPDATED_ETAT).nombre(UPDATED_NOMBRE);
        return utilisation;
    }

    @BeforeEach
    public void initTest() {
        utilisation = createEntity(em);
    }

    @Test
    @Transactional
    void createUtilisation() throws Exception {
        int databaseSizeBeforeCreate = utilisationRepository.findAll().size();
        // Create the Utilisation
        restUtilisationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(utilisation)))
            .andExpect(status().isCreated());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeCreate + 1);
        Utilisation testUtilisation = utilisationList.get(utilisationList.size() - 1);
        assertThat(testUtilisation.getElement()).isEqualTo(DEFAULT_ELEMENT);
        assertThat(testUtilisation.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testUtilisation.getNombre()).isEqualTo(DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    void createUtilisationWithExistingId() throws Exception {
        // Create the Utilisation with an existing ID
        utilisation.setId(1L);

        int databaseSizeBeforeCreate = utilisationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUtilisationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(utilisation)))
            .andExpect(status().isBadRequest());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkElementIsRequired() throws Exception {
        int databaseSizeBeforeTest = utilisationRepository.findAll().size();
        // set the field null
        utilisation.setElement(null);

        // Create the Utilisation, which fails.

        restUtilisationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(utilisation)))
            .andExpect(status().isBadRequest());

        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEtatIsRequired() throws Exception {
        int databaseSizeBeforeTest = utilisationRepository.findAll().size();
        // set the field null
        utilisation.setEtat(null);

        // Create the Utilisation, which fails.

        restUtilisationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(utilisation)))
            .andExpect(status().isBadRequest());

        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = utilisationRepository.findAll().size();
        // set the field null
        utilisation.setNombre(null);

        // Create the Utilisation, which fails.

        restUtilisationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(utilisation)))
            .andExpect(status().isBadRequest());

        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUtilisations() throws Exception {
        // Initialize the database
        utilisationRepository.saveAndFlush(utilisation);

        // Get all the utilisationList
        restUtilisationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(utilisation.getId().intValue())))
            .andExpect(jsonPath("$.[*].element").value(hasItem(DEFAULT_ELEMENT)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT)))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE.intValue())));
    }

    @Test
    @Transactional
    void getUtilisation() throws Exception {
        // Initialize the database
        utilisationRepository.saveAndFlush(utilisation);

        // Get the utilisation
        restUtilisationMockMvc
            .perform(get(ENTITY_API_URL_ID, utilisation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(utilisation.getId().intValue()))
            .andExpect(jsonPath("$.element").value(DEFAULT_ELEMENT))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingUtilisation() throws Exception {
        // Get the utilisation
        restUtilisationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUtilisation() throws Exception {
        // Initialize the database
        utilisationRepository.saveAndFlush(utilisation);

        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();

        // Update the utilisation
        Utilisation updatedUtilisation = utilisationRepository.findById(utilisation.getId()).get();
        // Disconnect from session so that the updates on updatedUtilisation are not directly saved in db
        em.detach(updatedUtilisation);
        updatedUtilisation.element(UPDATED_ELEMENT).etat(UPDATED_ETAT).nombre(UPDATED_NOMBRE);

        restUtilisationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUtilisation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUtilisation))
            )
            .andExpect(status().isOk());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
        Utilisation testUtilisation = utilisationList.get(utilisationList.size() - 1);
        assertThat(testUtilisation.getElement()).isEqualTo(UPDATED_ELEMENT);
        assertThat(testUtilisation.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testUtilisation.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void putNonExistingUtilisation() throws Exception {
        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();
        utilisation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUtilisationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, utilisation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(utilisation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUtilisation() throws Exception {
        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();
        utilisation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUtilisationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(utilisation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUtilisation() throws Exception {
        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();
        utilisation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUtilisationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(utilisation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUtilisationWithPatch() throws Exception {
        // Initialize the database
        utilisationRepository.saveAndFlush(utilisation);

        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();

        // Update the utilisation using partial update
        Utilisation partialUpdatedUtilisation = new Utilisation();
        partialUpdatedUtilisation.setId(utilisation.getId());

        restUtilisationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUtilisation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUtilisation))
            )
            .andExpect(status().isOk());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
        Utilisation testUtilisation = utilisationList.get(utilisationList.size() - 1);
        assertThat(testUtilisation.getElement()).isEqualTo(DEFAULT_ELEMENT);
        assertThat(testUtilisation.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testUtilisation.getNombre()).isEqualTo(DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    void fullUpdateUtilisationWithPatch() throws Exception {
        // Initialize the database
        utilisationRepository.saveAndFlush(utilisation);

        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();

        // Update the utilisation using partial update
        Utilisation partialUpdatedUtilisation = new Utilisation();
        partialUpdatedUtilisation.setId(utilisation.getId());

        partialUpdatedUtilisation.element(UPDATED_ELEMENT).etat(UPDATED_ETAT).nombre(UPDATED_NOMBRE);

        restUtilisationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUtilisation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUtilisation))
            )
            .andExpect(status().isOk());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
        Utilisation testUtilisation = utilisationList.get(utilisationList.size() - 1);
        assertThat(testUtilisation.getElement()).isEqualTo(UPDATED_ELEMENT);
        assertThat(testUtilisation.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testUtilisation.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void patchNonExistingUtilisation() throws Exception {
        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();
        utilisation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUtilisationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, utilisation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(utilisation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUtilisation() throws Exception {
        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();
        utilisation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUtilisationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(utilisation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUtilisation() throws Exception {
        int databaseSizeBeforeUpdate = utilisationRepository.findAll().size();
        utilisation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUtilisationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(utilisation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Utilisation in the database
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUtilisation() throws Exception {
        // Initialize the database
        utilisationRepository.saveAndFlush(utilisation);

        int databaseSizeBeforeDelete = utilisationRepository.findAll().size();

        // Delete the utilisation
        restUtilisationMockMvc
            .perform(delete(ENTITY_API_URL_ID, utilisation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Utilisation> utilisationList = utilisationRepository.findAll();
        assertThat(utilisationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
