package de.camunda.cryptouni.CryptoUni;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.connect.Connectors;
import org.camunda.connect.httpclient.HttpConnector;
import org.apache.http.HttpResponse;
import org.json.simple.JSONObject;

public class MessageEndTask implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) throws Exception {
		// TODO Auto-generated method stub
		String APPLICATION_ID = "application_id";
		String STATUS = "status";

		JSONObject obj=new JSONObject();
		obj.put(APPLICATION_ID, execution.getVariable("application_id"));
		obj.put(STATUS, execution.getVariable("statusNew"));
		System.out.print(obj);
		
		HttpClient httpClient = HttpClientBuilder.create().build();
		
		StringEntity requestEntity = new StringEntity(
				obj.toString(),
			    ContentType.APPLICATION_JSON
			    );

			HttpPost postMethod = new HttpPost("http://localhost:4000/sendStatus");
			postMethod.setEntity(requestEntity);

			HttpResponse rawResponse = httpClient.execute(postMethod);

		


	}

}
