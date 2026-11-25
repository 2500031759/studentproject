import { useMemo, useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

const tags = ['All', 'Announcement', 'Recruitment', 'Discussion'];

export default function CommunityPage() {
  const { community, publishCommunityPost, likeCommunityPost } = useArena();
  const { user } = useAuth();
  const notify = useToast();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const posts = useMemo(() => community.filter((post) => post.status === 'Approved'
    && (filter === 'All' || post.tag === filter)
    && `${post.author} ${post.body}`.toLowerCase().includes(query.toLowerCase())), [community, filter, query]);
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      publishCommunityPost({ tag: form.get('tag'), body: form.get('body').trim() });
      event.currentTarget.reset();
      notify('Your community post is live.');
    } catch (error) { notify(error.message, 'error'); }
  };
  return <main className="container page-wrap">
    <div className="page-heading-row"><div><span className="eyebrow-label">CONNECT WITH THE ARENA</span><h1>Community</h1><p>Share squad updates, ask questions, and connect with competitors.</p></div></div>
    {user && <form className="panel community-compose" onSubmit={submit}><label>Share an update<textarea name="body" className="field-input" rows="3" maxLength="400" required placeholder="What’s happening in your arena?" /></label><div><select className="field-input" name="tag">{tags.slice(1).map((tag) => <option key={tag}>{tag}</option>)}</select><button className="btn btn-primary" type="submit"><Send size={15} /> Publish</button></div></form>}
    <div className="community-toolbar"><div className="chip-row">{tags.map((tag) => <button key={tag} type="button" className={`chip${filter === tag ? ' active' : ''}`} onClick={() => setFilter(tag)}>{tag}</button>)}</div><input className="field-input community-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search community" /></div>
    <div className="community-feed">{posts.map((post) => <article className="panel community-post" key={post.id}><div className="feed-top"><div className="feed-author"><span className="feed-avatar">{post.author.slice(0, 2).toUpperCase()}</span><div><b>{post.author}</b><div className="muted">{new Date(`${post.date}T00:00:00`).toLocaleDateString()}</div></div></div><span className="status-tag">{post.tag}</span></div><p>{post.body}</p><div className="community-actions"><button type="button" onClick={() => likeCommunityPost(post.id)}><Heart size={16} /> {post.likes} likes</button><span><MessageCircle size={16} /> {post.replies} replies</span></div></article>)}
      {!posts.length && <div className="empty-state">No community posts match this filter.</div>}
    </div>
  </main>;
}
