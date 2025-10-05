import { User, Document } from "@knowledgescout/schemas";
import { Hono } from "hono";
import { mongo } from "~/lib";

export const ui = new Hono();

const baseStyles = `
<style>
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --danger: #dc2626;
  --success: #16a34a;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-600: #4b5563;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --border-radius: 6px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--gray-900);
  background: var(--gray-50);
  padding: 2rem 1rem;
}

.container {
  max-width: 56rem;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--gray-900);
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--gray-800);
}

.section {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: var(--gray-800);
  font-size: 0.875rem;
}

input, textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

button {
  padding: 0.625rem 1.25rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

button:hover {
  background: var(--primary-hover);
}

button:active {
  transform: translateY(1px);
}

.error {
  color: var(--danger);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.05);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--danger);
}

.info-box {
  padding: 1rem;
  background: rgba(37, 99, 235, 0.05);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--primary);
  margin-bottom: 1rem;
}

.info-box p {
  margin: 0.5rem 0;
}

.info-box strong {
  color: var(--gray-900);
}

ul {
  list-style: none;
  padding-left: 0;
}

ul li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--gray-100);
}

ul li:last-child {
  border-bottom: none;
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.15s ease;
}

a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.875rem;
}

thead {
  background: var(--gray-100);
}

th {
  text-align: left;
  padding: 0.75rem;
  font-weight: 600;
  color: var(--gray-800);
  border-bottom: 2px solid var(--gray-200);
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray-100);
}

tbody tr:hover {
  background: var(--gray-50);
}

.source-card {
  padding: 1.25rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  transition: box-shadow 0.15s ease;
}

.source-card:hover {
  box-shadow: var(--shadow);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.source-meta {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.source-text {
  margin: 0.75rem 0;
  line-height: 1.6;
}

.relevance {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
}

pre {
  background: var(--gray-100);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  overflow-x: auto;
  font-size: 0.8125rem;
}

code {
  font-family: 'Monaco', 'Courier New', monospace;
  background: var(--gray-100);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.8125rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: var(--success);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  body {
    padding: 1rem 0.5rem;
  }
  
  .container {
    padding: 1.25rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  table {
    font-size: 0.75rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style>
`;

ui.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KnowledgeScout - Info</title>
    ${baseStyles}
    <style>
    .endpoint {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--gray-50);
      border-radius: var(--border-radius);
      border-left: 3px solid var(--primary);
    }
    
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .method {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
      color: white;
    }
    
    .method.get {
      background: #16a34a;
    }
    
    .method.post {
      background: #2563eb;
    }
    
    .endpoint-path {
      font-family: 'Monaco', 'Courier New', monospace;
      font-weight: 600;
      font-size: 0.9375rem;
    }
    
    .endpoint-desc {
      color: var(--gray-600);
      margin-bottom: 0.5rem;
    }
    
    .endpoint-details {
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    
    .endpoint-details p {
      margin: 0.25rem 0;
    }
    
    .category {
      margin-top: 2rem;
    }
    
    .category:first-of-type {
      margin-top: 0;
    }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 KnowledgeScout API</h1>
        
        <div class="section">
            <h2>Quick Links</h2>
            <ul>
                <li><a href="/docs">📄 Documents Interface</a></li>
                <li><a href="/ask">💬 Ask Questions Interface</a></li>
                <li><a href="/admin">⚙️ Admin Dashboard</a></li>
                <li><a href="https://github.com/susmitadas22/knowledge-scout" target="_blank">GitHub Repository →</a></li>
            </ul>
        </div>
        
        <div class="section">
            <h2>API Documentation</h2>
            
            <div class="category">
                <h3>Authentication</h3>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/api/auth</span>
                    </div>
                    <p class="endpoint-desc">Create a user account</p>
                    <div class="endpoint-details">
                        <p><strong>Body:</strong> <code>email</code>, <code>password</code></p>
                        <p><strong>Returns:</strong> <code>userId</code>, <code>shareToken</code></p>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/api/user</span>
                    </div>
                    <p class="endpoint-desc">Get user details</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                    </div>
                </div>
            </div>

            <div class="category">
                <h3>Documents</h3>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/api/docs</span>
                    </div>
                    <p class="endpoint-desc">Upload a PDF document</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                        <p><strong>Body:</strong> <code>file</code> (PDF, form-data)</p>
                        <p><strong>Returns:</strong> <code>documentId</code></p>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/api/docs</span>
                    </div>
                    <p class="endpoint-desc">List all uploaded documents</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                        <p><strong>Query:</strong> <code>limit</code>, <code>offset</code> (pagination)</p>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/api/docs/:id</span>
                    </div>
                    <p class="endpoint-desc">Get specific document details</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                        <p><strong>Params:</strong> <code>id</code> (documentId)</p>
                    </div>
                </div>
            </div>

            <div class="category">
                <h3>Query</h3>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/api/ask</span>
                    </div>
                    <p class="endpoint-desc">Ask a question and get answers with sources</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                        <p><strong>Body:</strong> <code>query</code>, <code>k</code> (number of sources, default 3)</p>
                        <p><strong>Returns:</strong> Answers with document sources</p>
                    </div>
                </div>
            </div>

            <div class="category">
                <h3>Index Management</h3>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/api/index/rebuild</span>
                    </div>
                    <p class="endpoint-desc">Rebuild the vector search index</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/api/index/stats</span>
                    </div>
                    <p class="endpoint-desc">Get vector search index statistics</p>
                    <div class="endpoint-details">
                        <p><strong>Auth:</strong> Basic Auth required</p>
                    </div>
                </div>
            </div>

            <div class="category">
                <h3>Meta</h3>
                
                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/api/health</span>
                    </div>
                    <p class="endpoint-desc">Health check endpoint</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/api/_meta</span>
                    </div>
                    <p class="endpoint-desc">API metadata information</p>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/.well-known/hackathon.json</span>
                    </div>
                    <p class="endpoint-desc">Hackathon project metadata</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`);
});

ui.get("/docs", (c) => {
  return c.html(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KnowledgeScout - Documents</title>
    ${baseStyles}
</head>
<body>
    <div class="container">
        <h1>📄 Documents</h1>
        
        <div class="section">
            <div class="form-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    value="admin@mail.com"
                    required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    value="admin123"
                    required>
            </div>
            
            <button onclick="fetchDocs()">Fetch Documents</button>
        </div>

        <div id="error"></div>
        <div id="docsList"></div>
    </div>

    <script>
        function fetchDocs() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('error');
            const docsListEl = document.getElementById('docsList');
            
            errorEl.textContent = '';
            errorEl.className = '';
            docsListEl.innerHTML = '<p>Loading...</p>';

            fetch('/api/docs?limit=10&offset=0', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': 'Basic ' + btoa(email + ':' + password)
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch documents');
                }
                return res.json();
            })
            .then(data => {
                if (!data.items || data.items.length === 0) {
                    docsListEl.innerHTML = '<p>No documents found</p>';
                    return;
                }
                
                let html = '<table><thead><tr>';
                html += '<th>Filename</th>';
                html += '<th>Pages</th>';
                html += '<th>Size</th>';
                html += '<th>Status</th>';
                html += '<th>Uploaded</th>';
                html += '</tr></thead><tbody>';
                
                data.items.forEach(doc => {
                    html += '<tr>';
                    html += '<td>' + doc.originalName + '</td>';
                    html += '<td>' + doc.totalPages + '</td>';
                    html += '<td>' + (doc.fileSize / 1024).toFixed(1) + ' KB</td>';
                    html += '<td>' + doc.status + '</td>';
                    html += '<td>' + new Date(doc.uploadedAt).toLocaleString() + '</td>';
                    html += '</tr>';
                });
                
                html += '</tbody></table>';
                html += '<p style="margin-top: 1rem; font-weight: 500;">Total: ' + data.total + ' documents</p>';
                
                docsListEl.innerHTML = html;
            })
            .catch(err => {
                errorEl.textContent = err.message;
                errorEl.className = 'error';
                docsListEl.innerHTML = '';
            });
        }
    </script>
</body>
</html>
  `);
});

ui.get("/ask", (c) => {
  return c.html(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KnowledgeScout - Ask</title>
    ${baseStyles}
</head>
<body>
    <div class="container">
        <h1>💬 Ask Questions</h1>
        
        <div class="section">
            <div class="form-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    value="admin@mail.com"
                    required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    value="admin123"
                    required>
            </div>

            <div class="form-group">
                <label for="query">Query</label>
                <textarea 
                    id="query" 
                    rows="3"
                    placeholder="What is this document about?"
                    required></textarea>
            </div>

            <button onclick="askQuery()">Ask Query</button>
        </div>

        <div id="error"></div>
        <div id="results"></div>
    </div>

    <script>
        function askQuery() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const query = document.getElementById('query').value;
            const errorEl = document.getElementById('error');
            const resultsEl = document.getElementById('results');
            
            errorEl.textContent = '';
            errorEl.className = '';
            resultsEl.innerHTML = '<p>Loading...</p>';

            fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-authorization': 'Basic ' + btoa(email + ':' + password)
                },
                body: JSON.stringify({ query, k: 3 })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to query documents');
                }
                return res.json();
            })
            .then(data => {
                displayResults(data.answer);
            })
            .catch(err => {
                errorEl.textContent = err.message;
                errorEl.className = 'error';
                resultsEl.innerHTML = '';
            });
        }

        function displayResults(data) {
            const resultsEl = document.getElementById('results');
            
            if (!data.sources || data.sources.length === 0) {
                resultsEl.innerHTML = '<p>No results found</p>';
                return;
            }
            
            let html = '<div class="info-box">';
            html += '<p><strong>Query:</strong> ' + data.query + '</p>';
            html += '<p><strong>Found:</strong> ' + data.sources.length + ' sources</p>';
            if (data.cached) {
                html += '<p><span class="badge">CACHED</span></p>';
            }
            html += '</div>';
            
            data.sources.forEach((source, idx) => {
                html += '<div class="source-card">';
                html += '<div class="source-header">';
                html += '<strong>Source ' + (idx + 1) + '</strong>';
                html += '<span class="source-meta">' + source.filename + ' (Page ' + source.page + ')</span>';
                html += '</div>';
                html += '<p class="source-text">' + source.text + '</p>';
                html += '<p class="relevance">Relevance: ' + (source.score * 100).toFixed(1) + '%</p>';
                html += '</div>';
            });
            
            resultsEl.innerHTML = html;
        }
    </script>
</body>
</html>
  `);
});

ui.get("/admin", async (c) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const docsCount = await Document.countDocuments();

    // Get all users with their document counts
    const users = await User.find({}, { email: 1, createdAt: 1 }).lean();

    // Get document counts for each user
    const usersWithDocs = await Promise.all(
      users.map(async (user) => {
        const docCount = await Document.countDocuments({ userId: user._id });
        return {
          email: user.email,
          docCount,
          createdAt: user.createdAt,
        };
      })
    );

    // Check database health
    const dbHealth = await mongo.admin().ping();
    const isDatabaseHealthy = dbHealth && dbHealth.ok === 1;

    // Calculate system metrics
    const avgDocsPerUser =
      userCount > 0 ? (docsCount / userCount).toFixed(2) : 0;
    const activeUsers = usersWithDocs.filter((u) => u.docCount > 0).length;

    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>KnowledgeScout - Admin Dashboard</title>
          ${baseStyles}
          <style>
          .health-section {
              margin-bottom: 2rem;
          }
          
          .health-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
              margin-bottom: 2rem;
          }
          
          .health-card {
              padding: 1.25rem;
              background: white;
              border: 1px solid var(--gray-200);
              border-radius: var(--border-radius);
              box-shadow: var(--shadow-sm);
          }
          
          .health-card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5rem;
          }
          
          .health-label {
              font-size: 0.875rem;
              color: var(--gray-600);
              font-weight: 500;
          }
          
          .health-status {
              display: inline-flex;
              align-items: center;
              gap: 0.375rem;
              padding: 0.25rem 0.625rem;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 600;
          }
          
          .status-healthy {
              background: rgba(16, 185, 129, 0.1);
              color: #059669;
          }
          
          .status-warning {
              background: rgba(245, 158, 11, 0.1);
              color: #d97706;
          }
          
          .status-critical {
              background: rgba(239, 68, 68, 0.1);
              color: #dc2626;
          }
          
          .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: currentColor;
              animation: pulse 2s ease-in-out infinite;
          }
          
          @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
          }
          
          .health-value {
              font-size: 2rem;
              font-weight: 700;
              color: var(--gray-900);
              margin-top: 0.5rem;
          }
          
          .user-table-container {
              background: white;
              border: 1px solid var(--gray-200);
              border-radius: var(--border-radius);
              overflow: hidden;
              box-shadow: var(--shadow-sm);
          }
          
          .table-header {
              padding: 1.25rem;
              background: var(--gray-50);
              border-bottom: 1px solid var(--gray-200);
          }
          
          .table-header h2 {
              margin: 0;
              font-size: 1.125rem;
              font-weight: 600;
          }
          
          .user-table {
              width: 100%;
              border-collapse: collapse;
          }
          
          .user-table thead {
              background: var(--gray-50);
              border-bottom: 2px solid var(--gray-200);
          }
          
          .user-table th {
              text-align: left;
              padding: 0.875rem 1.25rem;
              font-size: 0.8125rem;
              font-weight: 600;
              color: var(--gray-700);
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }
          
          .user-table td {
              padding: 0.875rem 1.25rem;
              border-bottom: 1px solid var(--gray-100);
              font-size: 0.875rem;
          }
          
          .user-table tbody tr:hover {
              background: var(--gray-50);
          }
          
          .user-table tbody tr:last-child td {
              border-bottom: none;
          }
          
          .email-cell {
              font-family: 'Monaco', 'Courier New', monospace;
              color: var(--gray-900);
          }
          
          .doc-count {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 2rem;
              padding: 0.25rem 0.625rem;
              background: var(--primary);
              color: white;
              border-radius: 12px;
              font-weight: 600;
              font-size: 0.8125rem;
          }
          
          .doc-count-zero {
              background: var(--gray-200);
              color: var(--gray-600);
          }
          
          .date-cell {
              color: var(--gray-600);
              font-size: 0.8125rem;
          }
          
          .empty-state {
              text-align: center;
              padding: 3rem 1rem;
              color: var(--gray-600);
          }
          
          .refresh-button {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem 1rem;
              background: white;
              border: 1px solid var(--gray-200);
              border-radius: var(--border-radius);
              font-size: 0.875rem;
              font-weight: 500;
              color: var(--gray-700);
              cursor: pointer;
              transition: all 0.15s ease;
          }
          
          .refresh-button:hover {
              background: var(--gray-50);
              border-color: var(--gray-300);
          }
          
          .page-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2rem;
          }
          
          .page-header h1 {
              margin: 0;
          }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="page-header">
                  <h1>⚙️ Admin Dashboard</h1>
                  <button class="refresh-button" onclick="location.reload()">
                      <span>🔄</span>
                      <span>Refresh</span>
                  </button>
              </div>
              
              <div class="health-section">
                  <h2>System Health</h2>
                  <div class="health-grid">
                      <div class="health-card">
                          <div class="health-card-header">
                              <span class="health-label">Database</span>
                              <span class="health-status ${
                                isDatabaseHealthy
                                  ? "status-healthy"
                                  : "status-critical"
                              }">
                                  <span class="status-dot"></span>
                                  ${isDatabaseHealthy ? "Healthy" : "Down"}
                              </span>
                          </div>
                          <div class="health-value">${
                            isDatabaseHealthy ? "✓" : "✗"
                          }</div>
                      </div>
                      
                      <div class="health-card">
                          <div class="health-card-header">
                              <span class="health-label">API Status</span>
                              <span class="health-status status-healthy">
                                  <span class="status-dot"></span>
                                  Online
                              </span>
                          </div>
                          <div class="health-value">✓</div>
                      </div>
                      
                      <div class="health-card">
                          <div class="health-card-header">
                              <span class="health-label">Active Users</span>
                          </div>
                          <div class="health-value">${activeUsers}</div>
                          <p style="font-size: 0.75rem; color: var(--gray-600); margin-top: 0.25rem;">
                              ${((activeUsers / userCount) * 100).toFixed(
                                0
                              )}% of total users
                          </p>
                      </div>
                      
                      <div class="health-card">
                          <div class="health-card-header">
                              <span class="health-label">Avg Docs/User</span>
                          </div>
                          <div class="health-value">${avgDocsPerUser}</div>
                          <p style="font-size: 0.75rem; color: var(--gray-600); margin-top: 0.25rem;">
                              ${docsCount} total documents
                          </p>
                      </div>
                  </div>
              </div>
              
              <div class="user-table-container">
                  <div class="table-header">
                      <h2>User Management</h2>
                  </div>
                  ${
                    usersWithDocs.length > 0
                      ? `
                      <table class="user-table">
                          <thead>
                              <tr>
                                  <th>Email Address</th>
                                  <th>Documents</th>
                                  <th>Member Since</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${usersWithDocs
                                .map(
                                  (user) => `
                                  <tr>
                                      <td class="email-cell">${user.email}</td>
                                      <td>
                                          <span class="doc-count ${
                                            user.docCount === 0
                                              ? "doc-count-zero"
                                              : ""
                                          }">
                                              ${user.docCount}
                                          </span>
                                      </td>
                                      <td class="date-cell">
                                          ${new Date(
                                            user.createdAt
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                      </td>
                                  </tr>
                              `
                                )
                                .join("")}
                          </tbody>
                      </table>
                  `
                      : `
                      <div class="empty-state">
                          <p>No users found</p>
                      </div>
                  `
                  }
              </div>
          </div>
      </body>
      </html>
    `);
  } catch (error: any) {
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Dashboard - Error</title>
          ${baseStyles}
      </head>
      <body>
          <div class="container">
              <h1>⚙️ Admin Dashboard</h1>
              <div class="error">
                  Failed to load admin dashboard: ${error?.message}
              </div>
          </div>
      </body>
      </html>
    `);
  }
});
