import './explorar.css';
import * as React from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';

interface UsuarioLogado {
  id: number;
  nome: string;
  username: string;
}

interface Usuario {
  id: number;
  nome: string;
  username: string;
  email: string;
  criadoEm: string;
}

export function Explorar() {
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = React.useState<UsuarioLogado | null>(null);
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [busca, setBusca] = React.useState('');
  const [carregando, setCarregando] = React.useState(true);

  React.useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) setUsuarioLogado(JSON.parse(u));
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data.dados);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setCarregando(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.username.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Container>
        <Grid container className="feed-container">
          {/* Sidebar */}
          <Grid component="aside" size={2} className="sidebar">
            <Box>
              <img src="/assets/logo_growtweet.svg" alt="Logo GrowTweet" className="logo" />
              <nav aria-label="main mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/feed')}>
                      <ListItemIcon>
                        <HomeFilledIcon />
                      </ListItemIcon>
                      <ListItemText primary="Página Inicial" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton selected>
                      <ListItemIcon>
                        <TagIcon />
                      </ListItemIcon>
                      <ListItemText primary="Explorar" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => navigate(`/perfil/${usuarioLogado?.id}`)}
                    >
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Perfil" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Box>
            <Box className="profile-box">
              <Box className="user-profile-box">
                <Stack direction="row" spacing={2} className="avatar-user">
                  <Avatar alt={usuarioLogado?.nome} src={usuarioLogado?.nome} />
                </Stack>
                <Box className="user-info">
                  <strong>{usuarioLogado?.nome}</strong>
                  <p>@{usuarioLogado?.username}</p>
                </Box>
              </Box>
              <a onClick={handleLogout} className="logout">
                Sair
              </a>
            </Box>
          </Grid>

          {/* Conteúdo principal */}
          <Grid component="main" size={6} className="feed">
            <h1 className="explorar-title">Explorar</h1>

            {/* Barra de busca */}
            <Box className="search-box">
              <TextField
                fullWidth
                placeholder="Buscar usuários..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '30px' } }}
                size="small"
              />
            </Box>

            {/* Lista de usuários */}
            {carregando ? (
              <Typography sx={{ p: 2 }}>Carregando usuários...</Typography>
            ) : usuariosFiltrados.length === 0 ? (
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Nenhum usuário encontrado.
              </Typography>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <Box key={usuario.id} className="usuario-item">
                  <Avatar alt={usuario.nome} src={usuario.nome} />
                  <Box className="usuario-info" sx={{ flex: 1 }}>
                    <Typography fontWeight="bold">{usuario.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{usuario.username}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: '20px', borderColor: '#1da1f2', color: '#1da1f2' }}
                    onClick={() => navigate(`/perfil/${usuario.id}`)}
                  >
                    Ver perfil
                  </Button>
                </Box>
              ))
            )}
          </Grid>

          {/* Sidebar direita */}
          <Grid component="aside" size={3} className="trending">
            <Grid className="trending-content">
              <h1>O que está acontecendo?</h1>
              <Box className="trending-list">
                <Typography className="trending-category" component="span">
                  Esportes - Há 45 min
                </Typography>
                <Typography className="trending-item" component="strong">
                  Assunto sobre esportes
                </Typography>
              </Box>
              <Box className="trending-list">
                <Typography className="trending-category" component="span">
                  Assuntos no momento no Brasil
                </Typography>
                <Typography className="trending-item" component="strong">
                  Assunto do Momento
                </Typography>
              </Box>
              <Box className="trending-list">
                <Typography className="trending-category" component="span">
                  Música - Assuntos no momento
                </Typography>
                <Typography className="trending-item" component="strong">
                  Assunto sobre Música
                </Typography>
              </Box>
              <Box className="trending-list">
                <Typography className="trending-category" component="span">
                  Cinema - Assuntos no momento
                </Typography>
                <Typography className="trending-item" component="strong">
                  Assunto sobre Filmes e Cinema
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
