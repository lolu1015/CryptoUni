package de.camunda.cryptouni.CryptoUni;

import java.util.logging.Logger;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.connect.ConnectorRequestException;
import org.camunda.connect.ConnectorResponseException;
import org.camunda.connect.impl.ConnectLogger;

/**
 * This is an easy adapter implementation 
 * illustrating how a Java Delegate can be used 
 * from within a BPMN 2.0 Service Task.
 */
public class LoggerDelegate implements JavaDelegate {
 
  private final Logger LOGGER = Logger.getLogger(LoggerDelegate.class.getName());
  
  public void execute(DelegateExecution execution) throws Exception {
    
    LOGGER.info("\n\n  ... LoggerDelegate invoked by "
            + "processDefinitionId=" + execution.getProcessDefinitionId()
            + ", activtyId=" + execution.getCurrentActivityId()
            + ", activtyName='" + execution.getCurrentActivityName() + "'"
            + ", processInstanceId=" + execution.getProcessInstanceId()
            + ", businessKey=" + execution.getProcessBusinessKey()
            + ", executionId=" + execution.getId()
            + " \n\n");
    
  }
  
  public class HttpConnectorLogger extends ConnectLogger {

	  public void setHeader(String field, String value) {
	    logDebug("001", "Set header field '{}' to '{}'", field, value);
	  }

	  public void ignoreHeader(String field, String value) {
	    logInfo("002", "Ignoring header with name '{}' and value '{}'", field, value);

	  }

	  public void payloadIgnoredForHttpMethod(String method) {
	    logInfo("003", "Ignoring payload for HTTP '{}' method", method);
	  }

	  public ConnectorResponseException unableToReadResponse(Exception cause) {
	    return new ConnectorResponseException(exceptionMessage("004", "Unable to read connectorResponse: {}", cause.getMessage()), cause);
	  }

	  public ConnectorRequestException requestUrlRequired() {
	    return new ConnectorRequestException(exceptionMessage("005", "Request url required."));
	  }

	  public ConnectorRequestException unknownHttpMethod(String method) {
	    return new ConnectorRequestException(exceptionMessage("006", "Unknown or unsupported HTTP method '{}'", method));
	  }

	  public ConnectorRequestException unableToExecuteRequest(Exception cause) {
	    return new ConnectorRequestException(exceptionMessage("007", "Unable to execute HTTP request"), cause);
	  }

	}

}
