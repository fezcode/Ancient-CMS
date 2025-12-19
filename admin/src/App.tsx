import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ContentList from './pages/ContentList';
import ContentEditor from './pages/ContentEditor';
import MediaLibrary from './pages/MediaLibrary';
import Users from './pages/Users';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      
                      <Route path="/posts" element={<ContentList type="posts" title="Blog Posts" />} />
                      <Route path="/posts/new" element={<ContentEditor type="posts" />} />
                      <Route path="/posts/edit/:id" element={<ContentEditor type="posts" />} />

                      <Route path="/projects" element={<ContentList type="projects" title="Projects" />} />
                      <Route path="/projects/new" element={<ContentEditor type="projects" />} />
                      <Route path="/projects/edit/:id" element={<ContentEditor type="projects" />} />

                      <Route path="/stories" element={<ContentList type="stories" title="Stories" />} />
                      <Route path="/stories/new" element={<ContentEditor type="stories" />} />
                      <Route path="/stories/edit/:id" element={<ContentEditor type="stories" />} />

                      <Route path="/media" element={<MediaLibrary />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
