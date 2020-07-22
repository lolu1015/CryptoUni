package de.camunda.cryptouni.CryptoUni;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.json.simple.JSONObject;

public class MyTaskCreateListener implements TaskListener {

	@Override
	public void notify(DelegateTask delegateTask) {
		// TODO Auto-generated method stub
		System.out.print("MyTaskCreateListener delegateTask: " + delegateTask.getVariables().get("statusNew"));
		//delegateTask.setVariable("statusNew", delegateTask.getVariables().get("statusNew"));
		//delegateTask.setVariableLocal("statusNew", delegateTask.getVariables().get("statusNew"));
		
		
		

	}

	
}
