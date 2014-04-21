/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.semantic.semanticWebBrowser;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.query.ResultSetFormatter;
import com.semantic.utils.Utillity;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Kristijan
 */
public class WebServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet WebServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet WebServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String qParam = request.getParameter("q");
        switch (qParam) {
            case "getDatasets":
                getDatasets(request, response);
                break;
            case "getClasses":
                getClasses(request, response);
                break;
            case "getClassInstances":
                getClassInstances(request, response);
                break;
            case "getClassInProperties":
                getClassInProperties(request, response);
                break;
            case "getClassOutProperties":
                getClassOutProperties(request, response);
                break;
            default:
                break;

        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

    private void getDatasets(HttpServletRequest request, HttpServletResponse response)
    {
        try {
            response.getWriter().write(Utillity.getDatasets());
        } catch (Exception ex) {
            Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex);
            JSONObject errorJSON=new JSONObject();
            try {
                errorJSON.put("error", ex.toString());
                response.getWriter().write(errorJSON.toString());
            } catch (    JSONException | IOException ex1) {
                Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex1);
            }
            
        }
    }
    
    private void getClasses(HttpServletRequest request, HttpServletResponse response) {
        try {
            String dataset= URLDecoder.decode(request.getParameter("dataset"),"UTF-8");
            String sparqlQueryString =
                    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
                    + " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
                    + "PREFIX fn: <http://www.w3.org/2005/xpath-functions#>"
                    + "SELECT DISTINCT ?resource (?resource as ?name) where "
                    + "{ [] a ?resource } "
                    + "ORDER BY ?resource";


            Query query = QueryFactory.create(sparqlQueryString);
            QueryExecution qexec = QueryExecutionFactory.sparqlService(dataset, query);
            ResultSet results = qexec.execSelect();
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            ResultSetFormatter.outputAsJSON(b, results);
            String json = b.toString();
            qexec.close();
            response.getWriter().write(json);
        }catch (Exception ex) {
            Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex);
            JSONObject errorJSON=new JSONObject();
            try {
                errorJSON.put("error", ex.toString());
                response.getWriter().write(errorJSON.toString());
            } catch (    JSONException | IOException ex1) {
                Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex1);
            }
            
        }
    }

    private void getClassInstances(HttpServletRequest request, HttpServletResponse response) {
        try {
            String dataset= URLDecoder.decode(request.getParameter("dataset"),"UTF-8");
            String className = URLDecoder.decode(request.getParameter("class"),"UTF-8");
             String page = request.getParameter("page");
            JSONObject inProps=new JSONObject();
            JSONObject outProps=new JSONObject();
            StringBuilder sb = new StringBuilder();
            String filter = URLDecoder.decode(request.getParameter("filter"),"UTF-8");
            if(filter!=null)
            {
            JSONObject sel = new JSONObject(filter);
            inProps = (JSONObject) sel.get("inP");
            outProps = (JSONObject) sel.get("outP");
            }
            
            if (inProps.length() > 0 || outProps.length() > 0) {
                
                boolean union=false;
                
                Iterator<?> inKeys = inProps.keys();
                while (inKeys.hasNext()) {
                    String key = (String) inKeys.next();
                    JSONObject propSelection=inProps.getJSONObject(key);
                    JSONArray props=propSelection.getJSONArray("selection");
                    String filterInverse=propSelection.getString("filter");
                    for(int i=0;i<props.length();i++)
                    {
                      if("inverse".equals(filterInverse)) 
                      {
                      union=true;    
                      }
                      if(!union)
                      {
                       union=true;   
                      }
                      else
                      {
                       if("filter".equals(filterInverse))
                       sb.append("UNION");
                       else
                       sb.append("OPTIONAL");
                      }
                      
                        sb.append(" {<");
                        sb.append(props.get(i));
                        sb.append("> ");
                        sb.append("<");
                        sb.append(key);
                        sb.append(">");
                        sb.append(" ?resource.} ");
                        
                        if("inverse".equals(filterInverse))
                        {
                          sb.append("FILTER(!bound(?resource))");
                        }
                    }
                }
                
                Iterator<?> outKeys = outProps.keys();
                while (outKeys.hasNext()) {
                    String key = (String) outKeys.next();
                    JSONObject propSelection=outProps.getJSONObject(key);
                    JSONArray props=propSelection.getJSONArray("selection");
                    String filterInverse=propSelection.getString("filter");
                    for(int i=0;i<props.length();i++)
                    {
                      if("inverse".equals(filterInverse)) 
                      {
                      union=true;    
                      }
                      if(!union)
                      {
                       union=true;   
                      }
                      else
                      {
                       if("filter".equals(filterInverse))
                       sb.append("UNION");
                       else
                       sb.append("OPTIONAL");
                      }
                        
                        sb.append(" {?resource ");
                        sb.append("<");
                        sb.append(key);
                        sb.append(">");
                        sb.append(" <");
                        sb.append(props.get(i));
                        sb.append(">.} ");
                        
                        if("inverse".equals(filterInverse))
                        {
                          sb.append("FILTER(!bound(?resource))");
                        }
                        
                    }
                }
            }

                sb.append(" ?resource rdf:type <");
                sb.append(className);
                sb.append(">.");


            int limit = Utillity.getLimit(page);
            int offset = limit - 100;
            String sparqlQueryString =
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
                    + "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "
                    + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
                    + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
                    + "SELECT DISTINCT ?resource ?name where { "
                    + sb.toString()
                    + " ?resource rdfs:label ?name }"
                    + "OFFSET " + offset + " LIMIT " + limit;
            
            Query query = QueryFactory.create(sparqlQueryString);
            QueryExecution qexec = QueryExecutionFactory.sparqlService(dataset, query);
            
            ResultSet results = qexec.execSelect();
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            ResultSetFormatter.outputAsJSON(b, results);
            String json = b.toString();
            qexec.close();
            response.getWriter().write(json);
        }catch (Exception ex) {
            Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex);
            JSONObject errorJSON=new JSONObject();
            try {
                errorJSON.put("error", ex.toString());
                response.getWriter().write(errorJSON.toString());
            } catch (JSONException | IOException ex1) {
                Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex1);
            }
            
        }
    }

    private void getClassInProperties(HttpServletRequest request, HttpServletResponse response) {
        try {
            String dataset= URLDecoder.decode(request.getParameter("dataset"),"UTF-8");
            String className = URLDecoder.decode(request.getParameter("class"),"UTF-8");
            String sparqlQueryString =
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
                    + "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "
                    + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
                    + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
                    + "SELECT DISTINCT ?name ?resource WHERE "
                    + "{ ?s rdf:type <" + className + ">."
                    + " ?o ?name ?s."
                    + " ?o rdf:type ?resource }";

            Query query = QueryFactory.create(sparqlQueryString);
            QueryExecution qexec = QueryExecutionFactory.sparqlService(dataset, query);
            ResultSet results = qexec.execSelect();
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            ResultSetFormatter.outputAsJSON(b, results);
            String json = b.toString();
            qexec.close();
            response.getWriter().write(json);
        }catch (Exception ex) {
            Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex);
            JSONObject errorJSON=new JSONObject();
            try {
                errorJSON.put("error", ex.toString());
                response.getWriter().write(errorJSON.toString());
            } catch (JSONException | IOException ex1) {
                Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex1);
            }
            
        }
    }

    private void getClassOutProperties(HttpServletRequest request, HttpServletResponse response) {
        try {
            String dataset= URLDecoder.decode(request.getParameter("dataset"),"UTF-8");
            String className = URLDecoder.decode(request.getParameter("class"),"UTF-8");
            String sparqlQueryString =
                    "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
                    + "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> "
                    + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
                    + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
                    + "SELECT DISTINCT ?name ?resource WHERE "
                    + "{ ?s rdf:type <" + className + ">."
                    + " ?s ?name ?o."
                    + " ?o rdf:type ?resource }";

            Query query = QueryFactory.create(sparqlQueryString);
            QueryExecution qexec = QueryExecutionFactory.sparqlService(dataset, query);
            ResultSet results = qexec.execSelect();
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            ResultSetFormatter.outputAsJSON(b, results);
            String json = b.toString();
            qexec.close();
            response.getWriter().write(json);
        }catch (Exception ex) {
            Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex);
            JSONObject errorJSON=new JSONObject();
            try {
                errorJSON.put("error", ex.toString());
                response.getWriter().write(errorJSON.toString());
            } catch (JSONException | IOException ex1) {
                Logger.getLogger(WebServlet.class.getName()).log(Level.SEVERE, null, ex1);
            }
            
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
