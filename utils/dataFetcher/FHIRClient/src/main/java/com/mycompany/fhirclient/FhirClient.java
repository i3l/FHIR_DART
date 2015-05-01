
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.api.Bundle;
import ca.uhn.fhir.model.api.BundleEntry;
import ca.uhn.fhir.model.dstu.resource.Encounter;
import ca.uhn.fhir.model.dstu.resource.Immunization;
import ca.uhn.fhir.model.dstu.resource.Patient;
import ca.uhn.fhir.model.primitive.DateTimeDt;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.model.primitive.StringDt;
import ca.uhn.fhir.parser.DataFormatException;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.client.IGenericClient;
import ca.uhn.fhir.rest.client.api.IBasicClient;
import ca.uhn.fhir.rest.gclient.StringClientParam;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.JsonObject;
import org.json.simple.JSONObject;

public class FhirClient {

    public interface IRestfulClient extends IBasicClient {
 
    /**
     * The "@Read" annotation indicates that this method supports the
     * read operation. Read operations should return a single resource
     * instance.
     *
     * @param theId
     *    The read operation takes one parameter, which must be of type
     *    IdDt and must be annotated with the "@Read.IdParam" annotation.
     * @return
     *    Returns a resource matching this identifier, or null if none exists.
     */
    @Read()
    public Patient getResourceById(@IdParam IdDt theId);
 
    /**
     * The "@Search" annotation indicates that this method supports the
     * search operation. You may have many different method annotated with
     * this annotation, to support many different search criteria. This
     * example searches by family name.
     *
         * @param theId
     * @param theIdentifier
     *    This operation takes one parameter which is the search criteria. It is
     *    annotated with the "@Required" annotation. This annotation takes one argument,
     *    a string containing the name of the search criteria. The datatype here
     *    is StringDt, but there are other possible parameter types depending on the
     *    specific search criteria.
     * @return
     *    This method returns a list of Patients. This list may contain multiple
     *    matching resources, or it may also be empty.
     */
    
    @Search()
    public List<Patient> getAllPatients();
    
    @Search()
    public List<Encounter> getAllEncounters();
    
    @Search()
    public List<Encounter> getEncountersForPatient(@RequiredParam(name = Encounter.SP_SUBJECT) StringDt patient);
 
    }
    
    public static void main(String agrs[]) {
        //getEncounterList();
        getEncountersByPatient();
        //test();
    }

    public static void getEncounterList() {
        FhirContext ctx = new FhirContext();
        IRestfulClient client = ctx.newRestfulClient(IRestfulClient.class, "http://spark.furore.com/fhir");
        IGenericClient genClient = ctx.newRestfulGenericClient("http://spark.furore.com/fhir");
        
        List<Encounter> encounters = client.getAllEncounters();
        List<JSONObject> jsonEncounters = new ArrayList<JSONObject>();
        for(Encounter e : encounters) {
            String patientIdString[] = e.getSubject().getReference().toString().split("/");
            String patientId = patientIdString.length > 1 ? patientIdString[1] : null;
            
            if (patientId == null) {
                continue;
            }
            String visitType = e.getClassElement().getValueAsString();
            DateTimeDt eDate = e.getPeriod().getStartElement();
            String condition = "";
            if (e.getReason().getCoding().size() > 0) {
                condition = e.getReason().getCoding().get(0).getDisplay().toString();
            }
            
            System.out.println("Getting patient! for "+e.getSubject().getReference() + " with id = "+patientId);
            
            JSONObject currentEncounter = populatePatientInfo(client.getResourceById(e.getSubject().getReference()));
            currentEncounter.put("immunizations", getImmunizationsForPatient(genClient, patientId));
            currentEncounter.put("visit_type", visitType);
            currentEncounter.put("drugPrescribed", ""); 
            currentEncounter.put("job", "Landlord");
            currentEncounter.put("consultOrdered","CARDIOLOGY");
            currentEncounter.put("encounterDate",eDate);
            currentEncounter.put("conditionType","");
            currentEncounter.put("labTest","");
            jsonEncounters.add(currentEncounter);
            
        }
        
        try {
            FileWriter file = new FileWriter("encounters.json");
            file.write(jsonEncounters.toString());
            file.close();
        } catch (IOException ex) {
            System.out.println("Exception!! couldnt write");
        }
        
        
    }
    
    private static void getEncountersByPatient() {
        FhirContext ctx = new FhirContext();
        IGenericClient client = ctx.newRestfulGenericClient("http://spark.furore.com/fhir");
        Bundle bundle = client.search().forResource(Patient.class).execute();
        List<JSONObject> jsonPatients = new ArrayList<JSONObject>();
        for(Patient p : bundle.getResources(Patient.class)) {
            String pId = p.getId().toString().split("/")[5];
            System.out.println("Patient id = "+pId);
            JSONObject currentPatient = populatePatientInfo(p);
            
            List<JSONObject> jsonEncounters = new ArrayList<JSONObject>();
            
            for (Encounter e : getEncountersForPatient(client, pId)) {
                JSONObject currentEncounter = new JSONObject();
                currentEncounter.put("event", e.getClassElement().getValueAsString());
                currentEncounter.put("date", e.getClassElement().getValueAsString());
                currentEncounter.put("complain", e.getReason().getCoding().size() > 0 ? e.getReason().getCoding().get(0).getDisplay().toString() : " " );
                jsonEncounters.add(currentEncounter);
            }
            currentPatient.put("encounterList", jsonEncounters);
            currentPatient.put("immunizations", getImmunizationsForPatient(client, pId));
            
            jsonPatients.add(currentPatient);
          
               
        }
        
        try {
            FileWriter file = new FileWriter("encounterHistory.json");
            file.write(jsonPatients.toString());
            file.close();
        } catch (IOException ex) {
            System.out.println("Exception!! couldnt write");
        }
    }
    
    
    public static List<String> getImmunizationsForPatient(IGenericClient client , String patientId) {
        Bundle immBundle = client.search().forResource(Immunization.class)
                    .where(new StringClientParam("subject._id").matches().value(patientId))
                    .execute();
        List<String> immunizations = new ArrayList<String>();
        for(Immunization i : immBundle.getResources(Immunization.class)) {
            immunizations.add(i.getVaccineType().getText().toString());
        }
        
        return immunizations;
    }
    
    public static List<Encounter> getEncountersForPatient(IGenericClient client , String patientId) {
        Bundle encBundle = client.search().forResource(Encounter.class)
                    .where(new StringClientParam("subject._id").matches().value(patientId))
                    .execute();
        List<Encounter> encList  = new ArrayList<Encounter>();
        for(Encounter e : encBundle.getResources(Encounter.class)) {
            encList.add(e);
        }
        
        return encList;
    }
    
    public static JSONObject populatePatientInfo(Patient p) {
        String pId = p.getId().toString().split("/")[5];
        String patientGender = p.getGender().getCodingFirstRep().getCode().getValueAsString();
        Integer patientAge = 0;
        if (p.getBirthDate().getValueAsString() != null) {
            patientAge = 2015 - Integer.parseInt(p.getBirthDate().getValueAsString().split("-")[0]);
        }
        String maritalStatus = p.getMaritalStatus().getCodingFirstRep().getDisplay().toString();
        String providerId = "";
        if (p.getCareProvider().size() > 0) {
            providerId = p.getCareProvider().get(0).getReference().getValueAsString();
        }
        
        String city = p.getAddressFirstRep().getCity().toString();
        
        JSONObject currentPatient = new JSONObject();
        currentPatient.put("job", "Landlord");
        currentPatient.put("gender", patientGender);
        currentPatient.put("age", patientAge);
        currentPatient.put("state", city);
        currentPatient.put("providerId", providerId);
        currentPatient.put("marriage_status", maritalStatus);
        currentPatient.put("memberId", pId);
        
        return currentPatient;
        
    }
    
    /*
    private static void test() {
        FhirContext ctx = new FhirContext();
        IGenericClient client = ctx.newRestfulGenericClient("http://spark.furore.com/fhir");
        Bundle bundle = client.search().forResource(Patient.class)
                        .where(new StringClientParam("_id").matches().value("patient-name-one"))
                        .execute();
        for(Patient p : bundle.getResources(Patient.class)) {
            String pId = p.getId().toString().split("/")[5];
            System.out.println("Patient id = "+pId);
            
            Bundle immBundle = client.search().forResource(Immunization.class)
                    .where(new StringClientParam("subject._id").matches().value(pId))
                    .execute();
            
            
            for(Immunization e : immBundle.getResources(Immunization.class)) {
                
                System.out.println("got imm!! - "+e.getVaccineType().getText());
            }
            
            
          
               
        }
    }*/
    

}

