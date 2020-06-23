package de.camunda.cryptouni.CryptoUni;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

public class SynchronousServiceTask implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) throws Exception {
		// TODO Auto-generated method stub
		String status = (String) "zulassen";
		
		execution.setVariable("statusNew", status);
		
		System.out.print("\nInSynchronousTask: " + execution.getVariable("statusNew"));

	}

}
