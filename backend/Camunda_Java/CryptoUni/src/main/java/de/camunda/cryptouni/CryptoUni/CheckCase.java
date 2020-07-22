package de.camunda.cryptouni.CryptoUni;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

public class CheckCase implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) throws Exception {
		// TODO Auto-generated method stub
		
		if(execution.getVariable("moduleNewId").equals("123123")) {
			System.out.print("\nCheckCase: adaptive");
			execution.setVariable("adaptive", true);
		} else {
			System.out.print("\nCheckCase: normativ");
			execution.setVariable("adaptive", false);
		}
		
		System.out.print("\nCheckCase: " + execution.getVariable("status"));
		
		String status = (String) "warten";
		
		execution.setVariable("statusNew", status);
		
		System.out.print("\nCheckCase: " + execution.getVariable("statusNew"));
		

	}

}
