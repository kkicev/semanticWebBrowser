/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.semantic.utils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Kristijan
 */
public class Utillity {
    
    private static String datasets="";
    private static String[] datasetsList={"http://lod.openlinksw.com/sparql/","http://affymetrix.bio2rdf.org/sparql","http://chebi.bio2rdf.org/sparql","http://geneid.bio2rdf.org/sparql","http://go.bio2rdf.org/sparql","http://hgnc.bio2rdf.org/sparql","http://homologene.bio2rdf.org/sparql","http://cpd.bio2rdf.org/sparql","http://dr.bio2rdf.org/sparql","http://ec.bio2rdf.org/sparql",
                             "http://gl.bio2rdf.org/sparql","http://kegg.bio2rdf.org/sparql","http://rn.bio2rdf.org/sparql","http://mgi.bio2rdf.org/sparql","http://obo.bio2rdf.org/sparql","http://omim.bio2rdf.org/sparql","http://pdb.bio2rdf.org/sparql","http://pubmed.bio2rdf.org/sparql","http://reactome.bio2rdf.org/sparql",
                             "http://sgd.bio2rdf.org/sparql","http://uniprot.bio2rdf.org/sparql","http://unists.bio2rdf.org/sparql","http://services.data.gov/sparql","http://dbpedia.org/sparql","http://lsd.taxonconcept.org/sparql","http://rdf.farmbio.uu.se/chembl/sparql/","http://geo.linkeddata.es/sparql","http://lsd.taxonconcept.org/sparql",
                             "http://sonicbanana.cs.wright.edu:8890/sparql","http://linkedgeodata.org/sparql/","http://sw.unime.it:8890/sparql","http://en.openei.org/sparql","http://lsd.taxonconcept.org/sparql","http://harp.cs.wright.edu:8890/sparql","http://data.bib.uni-mannheim.de/sparql","http://linkeddata.uriburner.com/sparql",
                             
                             "http://acm.rkbexplorer.com/sparql/","http://budapest.rkbexplorer.com/sparql/","http://citeseer.rkbexplorer.com/sparql/","http://cordis.rkbexplorer.com/sparql/","http://courseware.rkbexplorer.com/sparql/","http://curriculum.rkbexplorer.com/sparql/","http://darmstadt.rkbexplorer.com/sparql/",
                             "http://dblp.rkbexplorer.com/sparql/","http://deepblue.rkbexplorer.com/sparql/","http://deploy.rkbexplorer.com/sparql/","http://dotac.rkbexplorer.com/sparql/","http://eprints.rkbexplorer.com/sparql/","http://era.rkbexplorer.com/sparql/","http://eurecom.rkbexplorer.com/sparql/","http://ft.rkbexplorer.com/sparql/",
                             "http://ibm.rkbexplorer.com/sparql/","http://ieee.rkbexplorer.com/sparql/","http://irit.rkbexplorer.com/sparql/","http://jisc.rkbexplorer.com/sparql/","http://kisti.rkbexplorer.com/sparql/","http://laas.rkbexplorer.com/sparql/","http://newcastle.rkbexplorer.com/sparql/","http://nsf.rkbexplorer.com/sparql/",
                             "http://oai.rkbexplorer.com/sparql/","http://os.rkbexplorer.com/sparql/","http://pisa.rkbexplorer.com/sparql/","http://rae2001.rkbexplorer.com/sparql/","http://resex.rkbexplorer.com/sparql/","http://risks.rkbexplorer.com/sparql/","http://roma.rkbexplorer.com/sparql/","http://southampton.rkbexplorer.com/sparql/",
                             "http://ulm.rkbexplorer.com/sparql/","http://unlocode.rkbexplorer.com/sparql/","http://wiki.rkbexplorer.com/sparql/","http://wordnet.rkbexplorer.com/sparql/","http://dbtune.org/classical/sparql/","http://eculture2.cs.vu.nl:5020/sparql/",
                             
                             "http://api.talis.com/stores/airports/services/sparql","http://api.talis.com/stores/bbc-backstage/services/sparql","http://api.talis.com/stores/bbc-backstage/services/sparql","http://api.talis.com/stores/bbc-wildlife/services/sparql","http://api.talis.com/stores/datagovuk/services/sparql",
                             "http://api.talis.com/stores/discogs","http://api.talis.com/stores/fanhubz/services/sparql","http://api.talis.com/stores/jgoodwin-genealogy/services/sparql","http://api.talis.com/stores/kwijibo-dev2/services/sparql","http://api.talis.com/stores/kwijibo-dev5/services/sparql","http://api.talis.com/stores/moseley/services/sparql",
                             "http://api.talis.com/stores/musicbrainz/services/sparql","http://api.talis.com/stores/openlibrary/services/sparql","http://api.talis.com/stores/pokedex/services/sparql","http://api.talis.com/stores/productdb/services/sparql","http://api.talis.com/stores/space/services/sparql","http://api.talis.com/stores/theviewfrom/services/sparql",
                             "http://services.data.gov.uk/business/sparql","http://services.data.gov.uk/education/sparql","http://services.data.gov.uk/patents/sparql","http://services.data.gov.uk/reference/sparql","http://services.data.gov.uk/research/sparql","http://services.data.gov.uk/statistics/sparql","http://services.data.gov.uk/transport/sparql",
    
                             "http://data.bibbase.org:2020/sparql","http://data.linkedct.org/sparql","http://data.linkedmdb.org/sparql","http://dblp.l3s.de/d2r/sparql","http://dbtune.org/musicbrainz/sparql","http://www4.wiwiss.fu-berlin.de/dblp/sparql","http://www4.wiwiss.fu-berlin.de/diseasome/sparql","http://www4.wiwiss.fu-berlin.de/drugbank/sparql",
                             "http://www4.wiwiss.fu-berlin.de/eurostat/sparql","http://www4.wiwiss.fu-berlin.de/factbook/sparql","http://www4.wiwiss.fu-berlin.de/gutendata/sparql","http://www4.wiwiss.fu-berlin.de/medicare/sparql","http://www4.wiwiss.fu-berlin.de/sider/sparql","http://www4.wiwiss.fu-berlin.de/stitch/sparql",
     
                             "http://data.semanticweb.org/sparql","http://lab3.libris.kb.se/sparql","http://www.rdfabout.com/sparql",
    
                             "http://cb.semsol.org/sparql","http://id.ndl.go.jp/auth/ndlsh/",
    
                             "http://revyu.com/sparql"};
    
    private static List<String> endpoints=new ArrayList<>();
    
    public static int getLimit(String page)
    {
      if(page!=null)  
      {
      int p=Integer.parseInt(page);
      return p*100;
      }
      else
      return 100;    
    }
    
    public static String getDatasets() throws MalformedURLException, IOException
    {
       
       if(datasets!=null && !datasets.equals("")) 
       {
        return datasets;   
       }
       else
       {
            if(endpoints.isEmpty()){
                DatasetReader dataReader=new DatasetReader();
                endpoints=dataReader.getSparqlEnpoints(DatasetReader.sparqlEnpointsUrl2);
                datasets=initializeEndpoints();
            }
            return datasets;
//           datasets=initializeDatasets();
//           return datasets;
       }
    }
    
    private static String initializeDatasets()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
//        sb.append("\"head\": {\"vars\": [ \"resource\" , \"name\" ]} ,");
        sb.append("\"results\": {\"bindings\": [");
        for (int i = 0; i < datasetsList.length; i++) {
            sb.append("{\"resource\": { \"type\": \"uri\" , \"value\": \"")
              .append(datasetsList[i]).append("\" } ,");
            sb.append("\"name\": { \"type\": \"literal\" , \"value\": \"")
              .append(datasetsList[i]).append("\" } }");
            if(i!=datasetsList.length-1)
            {
                sb.append(",");
            }
        }
        sb.append("]}");
        sb.append("}");
        
        return sb.toString();
        
    }
    
    private static String initializeEndpoints()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
//        sb.append("\"head\": {\"vars\": [ \"resource\" , \"name\" ]} ,");
        sb.append("\"results\": {\"bindings\": [");
        for (int i = 0; i < endpoints.size(); i++) {
            sb.append("{\"resource\": { \"type\": \"uri\" , \"value\": \"")
              .append(endpoints.get(i)).append("\" } ,");
            sb.append("\"name\": { \"type\": \"literal\" , \"value\": \"")
              .append(endpoints.get(i)).append("\" } }");
            if(i!=endpoints.size()-1)
            {
                sb.append(",");
            }
        }
        sb.append("]}");
        sb.append("}");
        
        return sb.toString();
        
    }
}
