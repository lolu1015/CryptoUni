package de.camunda.cryptouni.CryptoUni;

import java.util.HashMap;
import java.util.Map;

import org.camunda.bpm.application.PostDeploy;
import org.camunda.bpm.application.ProcessApplication;
import org.camunda.bpm.application.impl.ServletProcessApplication;
import org.camunda.bpm.engine.CaseService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.engine.variable.Variables;
import org.springframework.beans.factory.annotation.Value;

/**
 * Process Application exposing this application's resources the process engine. 
 */
@ProcessApplication
public class CamundaBpmProcessApplication extends ServletProcessApplication{

  private static final String PROCESS_DEFINITION_KEY = "CryptoUni";
  
  String MODUL_STANDARD_NAME = "";

  /**
   * In a @PostDeploy Hook you can interact with the process engine and access 
   * the processes the application has deployed. 
   */
  

  public void startCaseInstance(ProcessEngine processEngine, DelegateExecution execution) throws Exception {
    CaseService caseService = processEngine.getCaseService();
    
    caseService.createCaseInstanceByKey("subject_application",
        Variables.createVariables()
          .putValue("applicationSufficient", Variables.booleanValue(null))
          .putValue("rating", Variables.integerValue(null)));

  }

}
