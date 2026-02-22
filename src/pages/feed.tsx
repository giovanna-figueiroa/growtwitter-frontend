import * as React from 'react';
import { api } from '../services/api';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import {
  Avatar,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import TagIcon from '@mui/icons-material/Tag';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  id: number;
  nome: string;
  username: string;
}

interface Reply {
  id: number;
  conteudo: string;
  tipo: string;
  criadoEm: string;
  usuarioId: number;
  replyToId: number;
  usuario: {
    id: number;
    username: string;
    nome: string;
  };
}

interface Tweet {
  id: number;
  conteudo: string;
  tipo: string;
  criadoEm: string;
  usuarioId: number;
  replyToId: number | null;
  replies: Reply[];
  likes: Array<unknown>;
  _count?: { replies: number };
  usuario: {
    id: number;
    nome: string;
    username: string;
  };
}

export function Feed() {
  const navigate = useNavigate();

  // Modal novo tweet
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Modal reply
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [replyTweetId, setReplyTweetId] = React.useState<number | null>(null);
  const [replyConteudo, setReplyConteudo] = React.useState('');

  // Likes simulados (armazenados em localStorage)
  const [likedTweets, setLikedTweets] = React.useState<Set<number>>(() => {
    const saved = localStorage.getItem('likedTweets');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const [conteudo, setConteudo] = React.useState('');

  async function HandleNewTweets() {
    if (!conteudo.trim()) {
      alert('Escreva algo antes de publicar seu tweet.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para publicar um tweet');
      return;
    }
    try {
      await api.post(
        '/tweets',
        { conteudo, tipo: 'tweet' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConteudo('');
      handleClose();
      await HandleListTweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensagem?: string } } };
      const mensagem = err.response?.data?.mensagem;
      alert(mensagem || 'Erro ao publicar tweet');
    }
  }

  async function HandleReply() {
    if (!replyConteudo.trim()) {
      alert('Escreva algo antes de responder.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token || !replyTweetId) return;
    try {
      await api.post(
        `/tweets/${replyTweetId}/reply`,
        { conteudo: replyConteudo, tipo: 'reply' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyConteudo('');
      setReplyOpen(false);
      setReplyTweetId(null);
      await HandleListTweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensagem?: string } } };
      alert(err.response?.data?.mensagem || 'Erro ao responder tweet');
    }
  }

  // Função para alternar like
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

  const [tweets, setTweets] = React.useState<Tweet[]>([]);

  async function HandleListTweets() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await api.get('/tweets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tweetsPrincipais = (response.data.dados as Tweet[]).filter(
        (t) => t.tipo === 'tweet'
      );
      setTweets(tweetsPrincipais);
    } catch (error) {
      console.error('Erro ao buscar tweets:', error);
    }
  }

  const [usuario, setUsuario] = React.useState<Usuario | null>(null);

  React.useEffect(() => {
    const usuarioLogado = localStorage.getItem('usuario');
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  React.useEffect(() => {
    HandleListTweets();
  }, []);

  return (
    <>
      <Container>
        <Grid container className="feed-container">
          {/* Sidebar esquerda */}
          <Grid component="aside" size={2} className="sidebar">
            <Box>
              <img src="assets/logo_growtweet.svg" alt="Logo GrowTweet" className="logo" />
              <nav aria-label="main mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton selected onClick={() => navigate('/feed')}>
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
                    <ListItemButton onClick={() => navigate(`/perfil/${usuario?.id}`)}>
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Perfil" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
              <Button
                onClick={handleOpen}
                variant="contained"
                className="tweet-button"
                disableElevation
                sx={{ bgcolor: '#1da1f2', '&:hover': { bgcolor: '#0d8ddb' } }}
              >
                Tweetar
              </Button>
            </Box>
            <Box className="profile-box">
              <Box className="user-profile-box">
                <Stack direction="row" spacing={2} className="avatar-user">
                  <Avatar alt={usuario?.nome} src={usuario?.nome} />
                </Stack>
                <Box className="user-info">
                  <strong>{usuario?.nome}</strong>
                  <p>@{usuario?.username}</p>
                </Box>
              </Box>
              <a onClick={handleLogout} className="logout">
                Sair
              </a>
            </Box>
          </Grid>

          {/* Feed principal */}
          <Grid component="main" size={6} className="feed">
            <h1>Página Inicial</h1>
            {tweets.length === 0 ? (
              <Typography sx={{ p: 2, color: 'text.secondary' }}>
                Nenhum tweet encontrado. Seja o primeiro a tweetar!
              </Typography>
            ) : (
              tweets.map((tweet) => (
                <Grid key={tweet.id} className="tweet">
                  <Avatar
                    alt={tweet.usuario.nome}
                    src={tweet.usuario.nome}
                    className="avatar-content"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/perfil/${tweet.usuario.id}`)}
                  />
                  <Box className="post-content">
                    <Typography
                      component="strong"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/perfil/${tweet.usuario.id}`)}
                    >
                      {tweet.usuario.nome} - @{tweet.usuario.username}
                    </Typography>
                    <Typography component="span">
                      {new Date(tweet.criadoEm).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Typography component="p">{tweet.conteudo}</Typography>
                    <Box className="actions-content">
                      <Box
                        className="action-comments"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setReplyTweetId(tweet.id);
                          setReplyOpen(true);
                        }}
                      >
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

      {/* Modal de Novo Tweet */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Novo Tweet
              </Typography>
              <Button onClick={handleClose}>
                <CloseIcon />
              </Button>
            </Box>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="O que está acontecendo?"
              minRows={5}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                borderColor: '#ccc',
                resize: 'none',
              }}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={HandleNewTweets}
              sx={{ mt: 2, float: 'right', bgcolor: '#1da1f2' }}
            >
              Tweetar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Reply */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={replyOpen}>
          <Box sx={style}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Responder Tweet
              </Typography>
              <Button onClick={() => setReplyOpen(false)}>
                <CloseIcon />
              </Button>
            </Box>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Escreva sua resposta..."
              minRows={5}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                borderColor: '#ccc',
                resize: 'none',
              }}
              value={replyConteudo}
              onChange={(e) => setReplyConteudo(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={HandleReply}
              sx={{ mt: 2, float: 'right', bgcolor: '#1da1f2' }}
            >
              Responder
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
