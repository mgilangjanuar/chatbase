--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Enable update for users based on uid" ON public.chat_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable update for participants or admin" ON public.chat_rooms;
DROP POLICY IF EXISTS "Enable update for a specific user only" ON public.chat_authenticators;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.chat_profiles;
DROP POLICY IF EXISTS "Enable read access for all participants" ON public.chat_rooms;
DROP POLICY IF EXISTS "Enable read access for all participants" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable read access for a specific user" ON public.chat_authenticators;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.chat_rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.chat_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable insert for a specific user only" ON public.chat_authenticators;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.chat_messages;
DROP POLICY IF EXISTS "Enable delete for users based on uid" ON public.chat_profiles;
DROP POLICY IF EXISTS "Enable delete for participants or admin" ON public.chat_rooms;
DROP POLICY IF EXISTS "Enable delete for a specific user only" ON public.chat_authenticators;
ALTER TABLE IF EXISTS ONLY public.chat_rooms DROP CONSTRAINT chat_rooms_admin_id_fkey;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT chat_messages_room_id_fkey;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT chat_messages_profile_id_fkey;
ALTER TABLE IF EXISTS ONLY public.chat_authenticators DROP CONSTRAINT chat_authenticators_profile_id_fkey;
ALTER TABLE IF EXISTS ONLY public.chat_profiles DROP CONSTRAINT profiles_username_key;
ALTER TABLE IF EXISTS ONLY public.chat_profiles DROP CONSTRAINT profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_rooms DROP CONSTRAINT chat_room_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT chat_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_authenticators DROP CONSTRAINT chat_authenticators_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_authenticators DROP CONSTRAINT chat_authenticators_credential_id_key;
DROP TABLE IF EXISTS public.chat_rooms;
DROP TABLE IF EXISTS public.chat_profiles;
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.chat_authenticators;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_authenticators; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.chat_authenticators (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    profile_id uuid DEFAULT auth.uid() NOT NULL,
    data jsonb,
    credential_id text NOT NULL,
    name character varying,
    valid_until timestamp with time zone
);


ALTER TABLE public.chat_authenticators OWNER TO supabase_admin;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    message text NOT NULL,
    profile_id uuid DEFAULT auth.uid() NOT NULL,
    room_id uuid NOT NULL,
    type character varying DEFAULT 'text'::character varying NOT NULL
);


ALTER TABLE public.chat_messages OWNER TO supabase_admin;

--
-- Name: chat_profiles; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.chat_profiles (
    id uuid DEFAULT auth.uid() NOT NULL,
    username character varying DEFAULT auth.email() NOT NULL,
    name character varying NOT NULL,
    img_url character varying DEFAULT 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375__340.png'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    auth_challenge text
);


ALTER TABLE public.chat_profiles OWNER TO supabase_admin;

--
-- Name: chat_rooms; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.chat_rooms (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_message text DEFAULT 'Room created...'::text,
    participants uuid[] NOT NULL,
    type character varying DEFAULT 'personal'::character varying NOT NULL,
    admin_id uuid DEFAULT auth.uid(),
    title character varying,
    img_url character varying DEFAULT 'https://www.shareicon.net/data/512x512/2016/01/09/700702_network_512x512.png'::character varying
);


ALTER TABLE public.chat_rooms OWNER TO supabase_admin;

--
-- Name: chat_authenticators chat_authenticators_credential_id_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_authenticators
    ADD CONSTRAINT chat_authenticators_credential_id_key UNIQUE (credential_id);


--
-- Name: chat_authenticators chat_authenticators_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_authenticators
    ADD CONSTRAINT chat_authenticators_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: chat_rooms chat_room_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_rooms
    ADD CONSTRAINT chat_room_pkey PRIMARY KEY (id);


--
-- Name: chat_profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: chat_profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: chat_authenticators chat_authenticators_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_authenticators
    ADD CONSTRAINT chat_authenticators_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.chat_profiles(id);


--
-- Name: chat_messages chat_messages_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.chat_profiles(id);


--
-- Name: chat_messages chat_messages_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.chat_rooms(id) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Name: chat_rooms chat_rooms_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.chat_rooms
    ADD CONSTRAINT chat_rooms_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.chat_profiles(id);


--
-- Name: chat_authenticators Enable delete for a specific user only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for a specific user only" ON public.chat_authenticators FOR DELETE TO authenticated USING ((auth.uid() = profile_id));


--
-- Name: chat_rooms Enable delete for participants or admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for participants or admin" ON public.chat_rooms FOR DELETE TO authenticated USING ((((auth.uid() = ANY (participants)) AND ((type)::text = 'personal'::text)) OR (admin_id = auth.uid())));


--
-- Name: chat_profiles Enable delete for users based on uid; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for users based on uid" ON public.chat_profiles FOR DELETE TO authenticated USING ((auth.uid() = id));


--
-- Name: chat_messages Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for users based on user_id" ON public.chat_messages FOR DELETE TO authenticated USING ((auth.uid() = profile_id));


--
-- Name: chat_authenticators Enable insert for a specific user only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for a specific user only" ON public.chat_authenticators FOR INSERT TO authenticated WITH CHECK ((auth.uid() = profile_id));


--
-- Name: chat_messages Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for authenticated users only" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (((auth.uid() = profile_id) AND (room_id IN ( SELECT chat_rooms.id
   FROM public.chat_rooms
  WHERE (auth.uid() = ANY (chat_rooms.participants))))));


--
-- Name: chat_profiles Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for authenticated users only" ON public.chat_profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: chat_rooms Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for authenticated users only" ON public.chat_rooms FOR INSERT TO authenticated WITH CHECK ((((auth.uid() = ANY (participants)) AND ((type)::text = 'personal'::text)) OR (admin_id = auth.uid())));


--
-- Name: chat_authenticators Enable read access for a specific user; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for a specific user" ON public.chat_authenticators FOR SELECT TO authenticated USING ((auth.uid() = profile_id));


--
-- Name: chat_messages Enable read access for all participants; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all participants" ON public.chat_messages FOR SELECT TO authenticated USING ((room_id IN ( SELECT chat_rooms.id
   FROM public.chat_rooms
  WHERE (auth.uid() = ANY (chat_rooms.participants)))));


--
-- Name: chat_rooms Enable read access for all participants; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all participants" ON public.chat_rooms FOR SELECT TO authenticated USING ((auth.uid() = ANY (participants)));


--
-- Name: chat_profiles Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON public.chat_profiles FOR SELECT TO authenticated USING (true);


--
-- Name: chat_authenticators Enable update for a specific user only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for a specific user only" ON public.chat_authenticators FOR UPDATE TO authenticated USING ((auth.uid() = profile_id)) WITH CHECK ((auth.uid() = profile_id));


--
-- Name: chat_rooms Enable update for participants or admin; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for participants or admin" ON public.chat_rooms FOR UPDATE TO authenticated USING ((((auth.uid() = ANY (participants)) AND ((type)::text = 'personal'::text)) OR (admin_id = auth.uid()))) WITH CHECK ((((auth.uid() = ANY (participants)) AND ((type)::text = 'personal'::text)) OR (admin_id = auth.uid())));


--
-- Name: chat_messages Enable update for users based on email; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for users based on email" ON public.chat_messages FOR UPDATE TO authenticated USING ((auth.uid() = profile_id)) WITH CHECK ((auth.uid() = profile_id));


--
-- Name: chat_profiles Enable update for users based on uid; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for users based on uid" ON public.chat_profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: chat_authenticators; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.chat_authenticators ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_profiles; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.chat_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_rooms; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: TABLE chat_authenticators; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.chat_authenticators TO postgres;
GRANT ALL ON TABLE public.chat_authenticators TO anon;
GRANT ALL ON TABLE public.chat_authenticators TO authenticated;
GRANT ALL ON TABLE public.chat_authenticators TO service_role;


--
-- Name: TABLE chat_messages; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.chat_messages TO postgres;
GRANT ALL ON TABLE public.chat_messages TO anon;
GRANT ALL ON TABLE public.chat_messages TO authenticated;
GRANT ALL ON TABLE public.chat_messages TO service_role;


--
-- Name: TABLE chat_profiles; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.chat_profiles TO postgres;
GRANT ALL ON TABLE public.chat_profiles TO anon;
GRANT ALL ON TABLE public.chat_profiles TO authenticated;
GRANT ALL ON TABLE public.chat_profiles TO service_role;


--
-- Name: TABLE chat_rooms; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.chat_rooms TO postgres;
GRANT ALL ON TABLE public.chat_rooms TO anon;
GRANT ALL ON TABLE public.chat_rooms TO authenticated;
GRANT ALL ON TABLE public.chat_rooms TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- PostgreSQL database dump complete
--

