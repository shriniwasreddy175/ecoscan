
CREATE TABLE IF NOT EXISTS public.carbon_factors
(
    id bigint NOT NULL DEFAULT nextval('carbon_factors_id_seq'::regclass),
    emission_per_kg double precision,
    material character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT carbon_factors_pkey PRIMARY KEY (id),
    CONSTRAINT carbon_factors_material_key UNIQUE (material)
);

CREATE TABLE IF NOT EXISTS public.products
(
    id bigint NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    carbon_footprint double precision,
    category character varying(255) COLLATE pg_catalog."default",
    description character varying(1000) COLLATE pg_catalog."default",
    eco_score integer,
    material character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    price double precision,
    shadow_cost double precision,
    weight double precision,
    transport_distance double precision,
    created_at timestamp without time zone DEFAULT now(),
    user_id character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_users_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    full_name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    organization character varying(150) COLLATE pg_catalog."default",
    role character varying(50) COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone,
    user_id character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_user_id_key UNIQUE (user_id)
);