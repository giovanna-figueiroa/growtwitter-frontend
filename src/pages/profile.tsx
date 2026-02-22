import * as React from 'react';
import { api } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
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
  Typography,
} from '@mui/material';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './profile.css';

interface UsuarioLogado {
  id: number;
  nome: string;
  username: string;
}

interface UsuarioPerfil {
  id: number;
  nome: string;
  username: string;
  email: string;
  criadoEm: string;
}

interface Tweet {
  id: number;
  conteudo: string;
  tipo: string;
  criadoEm: string;
  usuarioId: number;
  replyToId: number | null;
  usuario: {
    id: number;
    nome: string;
    username: string;
  };
  replies: Array<{
    id: number;
    conteudo: string;
    tipo: string;
    criadoEm: string;
    usuarioId: number;
    usuario: { id: number; username: string; nome: string };
  }>;
  likes: Array<unknown>;
  _count?: { replies: number };
}

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [usuarioLogado, setUsuarioLogado] = React.useState<UsuarioLogado | null>(null);
  const [perfil, setPerfil] = React.useState<UsuarioPerfil | null>(null);
  const [tweets, setTweets] = React.useState<Tweet[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [likedTweets, setLikedTweets] = React.useState<Set<number>>(() => {
    const saved = localStorage.getItem('likedTweets');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [seguidos, setSeguidos] = React.useState<{ [key: number]: boolean }>(() => {
    const saved = localStorage.getItem('seguidos');
    return saved ? JSON.parse(saved) : {};
  });

  React.useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) setUsuarioLogado(JSON.parse(u));
    carregarSeguidos();
  }, []);

  function carregarSeguidos() {
    const seguidosArmazenados = localStorage.getItem('seguidos');
    if (seguidosArmazenados) {
      setSeguidos(JSON.parse(seguidosArmazenados));
    }
  }

  function handleFollow(usuarioId: number) {
    const novosSeguidos = { ...seguidos };
    novosSeguidos[usuarioId] = !novosSeguidos[usuarioId];
    setSeguidos(novosSeguidos);
    localStorage.setItem('seguidos', JSON.stringify(novosSeguidos));
  }

  const usuarioId = id || (usuarioLogado ? String(usuarioLogado.id) : null);

  React.useEffect(() => {
    if (!usuarioId) return;
    carregarPerfil(usuarioId);
    carregarTweets(usuarioId);
  }, [usuarioId]);

  async function carregarPerfil(uid: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/user/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerfil(response.data.dados);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  async function carregarTweets(uid: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/tweets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const todosTweets: Tweet[] = response.data.dados;
      const tweetsDoPerfil = todosTweets.filter(
        (t) => t.usuarioId === Number(uid) && t.tipo === 'tweet'
      );
      setTweets(tweetsDoPerfil);
    } catch (error) {
      console.error('Erro ao carregar tweets:', error);
    } finally {
      setCarregando(false);
    }
  }

  function toggleLike(tweetId: number) {
    setLikedTweets((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(tweetId)) {
        newLiked.delete(tweetId);
      } else {
        newLiked.add(tweetId);
      }
      // Salvar no localStorage
      localStorage.setItem('likedTweets', JSON.stringify(Array.from(newLiked)));
      return newLiked;
    });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  const isProprioPeril = usuarioLogado && Number(usuarioId) === usuarioLogado.id;

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
                    <ListItemButton onClick={() => navigate('/explorar')}>
                      <ListItemIcon>
                        <TagIcon />
                      </ListItemIcon>
                      <ListItemText primary="Explorar" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() =>
                        navigate(`/perfil/${usuarioLogado?.id}`)
                      }
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
            {/* Cabeçalho do perfil */}
            <Box className="profile-header">
              <Box className="profile-cover" />
              <Box className="profile-info-box">
                <Avatar
                  alt={perfil?.nome}
                  src={perfil?.nome}
                  className="profile-avatar"
                />
                <Box className="profile-details">
                  <Typography variant="h6">
                    {perfil?.nome || 'Carregando...'}
                  </Typography>
                  <Typography variant="body2">
                    @{perfil?.username}
                  </Typography>
                  <Typography variant="caption">
                    Membro desde{' '}
                    {perfil?.criadoEm
                      ? new Date(perfil.criadoEm).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                  </Typography>
                </Box>
                {!isProprioPeril && (
                  <Button
                    variant={seguidos[Number(usuarioId)] ? 'contained' : 'outlined'}
                    className="follow-button"
                    sx={{
                      borderRadius: '20px',
                      borderColor: '#1da1f2',
                      backgroundColor: seguidos[Number(usuarioId)] ? '#1da1f2' : 'transparent',
                      color: seguidos[Number(usuarioId)] ? 'white' : '#1da1f2',
                      '&:hover': {
                        backgroundColor: seguidos[Number(usuarioId)] ? '#1a8cd8' : 'rgba(29, 161, 242, 0.1)',
                      },
                    }}
                    onClick={() => handleFollow(Number(usuarioId))}
                  >
                    {seguidos[Number(usuarioId)] ? 'Seguindo' : 'Seguir'}
                  </Button>
                )}
              </Box>
            </Box>

            <h1 className="profile-tweets-title">Tweets</h1>

            {carregando ? (
              <Typography sx={{ p: 2 }}>Carregando tweets...</Typography>
            ) : tweets.length === 0 ? (
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Nenhum tweet ainda.
              </Typography>
            ) : (
              tweets.map((tweet) => (
                <Grid key={tweet.id} className="tweet">
                  <Avatar
                    alt={tweet.usuario.nome}
                    src={tweet.usuario.nome}
                    className="avatar-content"
                  />
                  <Box className="post-content">
                    <Typography component="strong">
                      {tweet.usuario.nome} - @{tweet.usuario.username}
                    </Typography>
                    <Typography component="span">
                      {new Date(tweet.criadoEm).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Typography component="p">{tweet.conteudo}</Typography>
                    <Box className="actions-content">
                      <Box className="action-comments">
                        <CommentIcon />
                        {tweet.replies.length}
                      </Box>
                      <Box
                        className="action-likes"
                        sx={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: likedTweets.has(tweet.id) ? '#e74c3c' : 'inherit',
                        }}
                        onClick={() => toggleLike(tweet.id)}
                      >
                        {likedTweets.has(tweet.id) ? (
                          <FavoriteIcon sx={{ color: '#e74c3c' }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                        {tweet.likes.length + (likedTweets.has(tweet.id) ? 1 : 0)}
                      </Box>
                    </Box>
                    {/* Replies */}
                    {tweet.replies.length > 0 && (
                      <Box className="replies-box">
                        {tweet.replies.map((reply) => (
                          <Box key={reply.id} className="reply-item">
                            <Avatar
                              alt={reply.usuario.nome}
                              src={reply.usuario.nome}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Box>
                              <Typography variant="caption" fontWeight="bold">
                                {reply.usuario.nome} @{reply.usuario.username}
                              </Typography>
                              <Typography variant="body2">{reply.conteudo}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))
            )}
          </Grid>

          {/* Sidebar direita */}
          <Grid component="aside" size={3} className="trending">
            <Grid className="trending-content">
              <h1>Quem seguir</h1>
              <Typography variant="body2" color="text.secondary">
                Acesse a página Explorar para descobrir outros usuários.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
