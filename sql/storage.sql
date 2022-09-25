--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.buckets VALUES ('chat-attachments', 'chat-attachments', NULL, '2022-09-23 09:29:29.202132+00', '2022-09-23 09:29:29.202132+00', false);

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: objects enable upload for participants 14tobej_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "enable upload for participants 14tobej_0" ON storage.objects FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'chat-attachments'::text) AND ((storage.foldername(name))[1] IN ( SELECT (chat_rooms.id)::text AS id
   FROM public.chat_rooms
  WHERE (auth.uid() = ANY (chat_rooms.participants))))));


--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: objects read by room participants 14tobej_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "read by room participants 14tobej_0" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'chat-attachments'::text) AND ((storage.foldername(name))[1] IN ( SELECT (chat_rooms.id)::text AS id
   FROM public.chat_rooms
  WHERE (auth.uid() = ANY (chat_rooms.participants))))));