/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.semantic.utils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Kristijan
 */
public class DatasetReader {
    
    public static final String sparqlEnpointsUrl1="http://spitfire-project.eu/incontextsensing/lib/categories-map.txt";
    public static final String sparqlEnpointsUrl2="http://www.brunni.de/sparqlendpoints.txt";
    
   

    public List<String> getSparqlEnpoints(String urlAddr) throws MalformedURLException, IOException{
            URL url = new URL(urlAddr);
            Scanner scanner = new Scanner(url.openStream());
            List<String> result=new ArrayList<>();
            int i=0;
            while(scanner.hasNext())
            {
              String line=scanner.nextLine();
              if(line!=null && line.contains("http://") && !line.contains("txt"))
              {
                if(!line.contains("no access"))
                {
                  String sparqlEndpoint=line.substring(line.indexOf("http://"), line.indexOf(">"));
                  result.add(sparqlEndpoint);
                  i++;
                }
              }
            }
            return result;
        
    }
           
    
}
