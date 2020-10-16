
/* tabla de marcas */

CREATE TABLE public.brand
(
    id integer NOT NULL DEFAULT nextval('brand_id_seq'::regclass),
    description character varying(100) COLLATE pg_catalog."default",
    image character varying(200) COLLATE pg_catalog."default",
    deleted boolean NOT NULL DEFAULT false,
    id_customer integer NOT NULL,
    CONSTRAINT brand_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.brand
    OWNER to postgres;

COMMENT ON TABLE public.brand
    IS 'Marcas comerciales de un cliente asociadas a un local';

COMMENT ON COLUMN public.brand.description
    IS 'Nombre de la marca';

/* tabla de circuitos */

CREATE TABLE public.circuit
(
    id integer NOT NULL DEFAULT nextval('circuit_id_seq'::regclass),
    value_ character varying(100) COLLATE pg_catalog."default",
    id_description integer NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT circuit_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.circuit
    OWNER to postgres;

COMMENT ON TABLE public.circuit
    IS 'Circuitos de pantallas

Ahora no se usan ya que no hay pantallas publicas';

/* tabla de telefonos de contacto */

CREATE TABLE public.contact_phone
(
    id integer NOT NULL DEFAULT nextval('contact_phone_id_seq'::regclass),
    id_contact_place integer NOT NULL,
    phone_number character varying(18) COLLATE pg_catalog."default" NOT NULL,
    notes character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT contact_phone_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.contact_phone
    OWNER to postgres;

COMMENT ON TABLE public.contact_phone
    IS 'Teléfonos de contacto del local';

/* tablas de contacto del local */

CREATE TABLE public.contact_place
(
    id integer NOT NULL DEFAULT nextval('contact_place_id_seq'::regclass),
    name character varying(30) COLLATE pg_catalog."default" NOT NULL,
    email character varying(40) COLLATE pg_catalog."default",
    id_place integer NOT NULL,
    notes character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT contact_place_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.contact_place
    OWNER to postgres;

COMMENT ON TABLE public.contact_place
    IS 'Personas de contacto del local';

    /* tabla de paises */

CREATE TABLE public.country
(
    id integer NOT NULL DEFAULT nextval('country_id_seq'::regclass),
    id_description integer NOT NULL,
    code1 character(2) COLLATE pg_catalog."default" NOT NULL,
    code2 integer NOT NULL,
    code_iso character(3) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT country_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.country
    OWNER to postgres;

    /* tabla de clientes */

    CREATE TABLE public.customer
(
    id integer NOT NULL DEFAULT nextval('cutomer_id_seq'::regclass),
    identification character varying(15) COLLATE pg_catalog."default" NOT NULL,
    owner_ boolean NOT NULL,
    name character varying(20) COLLATE pg_catalog."default",
    deleted boolean NOT NULL DEFAULT false,
    phone_number character varying(18) COLLATE pg_catalog."default",
    CONSTRAINT cutomer_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.customer
    OWNER to postgres;

COMMENT ON TABLE public.customer
    IS 'Clientes';

/* tabla de idiomas */
CREATE TABLE public.languaje
(
    id integer NOT NULL DEFAULT nextval('languaje_id_seq'::regclass),
    value_ character varying(100) COLLATE pg_catalog."default",
    description character varying(150) COLLATE pg_catalog."default",
    image character varying(150) COLLATE pg_catalog."default",
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT languaje_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.languaje
    OWNER to postgres;

COMMENT ON TABLE public.languaje
    IS 'Idiomas soportados de por la aplicacion';

/* tabla de descripciones por idiomas */

CREATE TABLE public.languaje_description
(
    id integer NOT NULL DEFAULT nextval('languaje_description_id_seq'::regclass),
    id_languaje integer NOT NULL,
    id_description integer NOT NULL,
    text_ character varying(150) COLLATE pg_catalog."default",
    CONSTRAINT languaje_description_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.languaje_description
    OWNER to postgres;

/* tabla de localizaciones */

CREATE TABLE public.location
(
    id integer NOT NULL DEFAULT nextval('location_id_seq'::regclass),
    id_territorial_ent integer NOT NULL,
    id_place integer NOT NULL,
    hierarchy_ integer,
    id_territorial_org integer NOT NULL,
    CONSTRAINT location_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.location
    OWNER to postgres;

COMMENT ON TABLE public.location
    IS 'Localidad geográfica del local';

/* tabla de regiones comerciales del cliente */

CREATE TABLE public.market_region
(
    id integer NOT NULL DEFAULT nextval('market_region_id_seq'::regclass),
    description character varying(100) COLLATE pg_catalog."default",
    id_customer integer NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT market_region_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.market_region
    OWNER to postgres;

COMMENT ON TABLE public.market_region
    IS 'Regiones comerciales de un cliente';

COMMENT ON COLUMN public.market_region.description
    IS 'Descripción de la region comercial del cliente';

COMMENT ON COLUMN public.market_region.id_customer
    IS 'id del Cliente';

/* tabla de redes */

CREATE TABLE public.network
(
    id integer NOT NULL DEFAULT nextval('net_id_seq'::regclass),
    value_ character varying(100) COLLATE pg_catalog."default",
    id_description integer NOT NULL,
    default_ boolean NOT NULL DEFAULT false,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT net_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.network
    OWNER to postgres;

COMMENT ON TABLE public.network
    IS 'Redes de pantallas. Permiten crear grupos de pantallas
No utilizada en este momento esta penado para el uso publico de pantallas';

/* tabla de SO players */

CREATE TABLE public.operating_system
(
    id integer NOT NULL DEFAULT nextval('operating_system_id_seq'::regclass),
    description character varying(100) COLLATE pg_catalog."default" NOT NULL,
    os_type character(1) COLLATE pg_catalog."default" NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT operating_system_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.operating_system
    OWNER to postgres;

COMMENT ON TABLE public.operating_system
    IS 'Sistemas operativos del player';

COMMENT ON COLUMN public.operating_system.os_type
    IS '0  free OS
1  propietary OS';

/* tabla de parametros de la aplicacion */

CREATE TABLE public.parameter
(
    id integer NOT NULL DEFAULT nextval('parameter_id_seq'::regclass),
    column_ character varying(25) COLLATE pg_catalog."default",
    value_ character varying(200) COLLATE pg_catalog."default",
    description_ character varying(200) COLLATE pg_catalog."default",
    id_description integer,
    CONSTRAINT parameter_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.parameter
    OWNER to postgres;

COMMENT ON TABLE public.parameter
    IS 'Datos generales y valores posibles para columnas';

/* tabla de places locales donde se instalan pantallas */

CREATE TABLE public.place
(
    id integer NOT NULL DEFAULT nextval('place_id_seq'::regclass),
    id_customer integer NOT NULL,
    name character varying(150) COLLATE pg_catalog."default",
    id_road_type integer NOT NULL,
    address character varying(200) COLLATE pg_catalog."default" NOT NULL,
    street_number character varying(50) COLLATE pg_catalog."default",
    id_country integer NOT NULL,
    postal_code character varying(10) COLLATE pg_catalog."default",
    latitude numeric(10,6),
    longitude numeric(10,6),
    id_market_region integer,
    id_brand integer,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT place_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.place
    OWNER to postgres;

COMMENT ON TABLE public.place
    IS 'Local donde se sitúan las pantallas';

    /* tabla de horarios de los locales */

    CREATE TABLE public.place_schedule
(
    id integer NOT NULL DEFAULT nextval('place_schedule_id_seq'::regclass),
    id_place integer NOT NULL,
    week_schedule character varying(126) COLLATE pg_catalog."default" NOT NULL,
    schedule_type character varying COLLATE pg_catalog."default",
    CONSTRAINT place_schedule_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.place_schedule
    OWNER to postgres;

COMMENT ON TABLE public.place_schedule
    IS 'Horario del local';

 /* tabla de players */  
CREATE TABLE public.player
(
    id integer NOT NULL DEFAULT nextval('player_id_seq'::regclass),
    id_site integer NOT NULL,
    serial_number character varying(30) COLLATE pg_catalog."default",
    mac character varying(25) COLLATE pg_catalog."default",
    orientation character(1) COLLATE pg_catalog."default",
    id_os integer NOT NULL,
    os_version character varying(20) COLLATE pg_catalog."default",
    app_version character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT player_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.player
    OWNER to postgres;

COMMENT ON TABLE public.player
    IS 'Reproductor asociado al emplazamiento';
    
 /* tabla de road types */  

CREATE TABLE public.road_type
(
    id integer NOT NULL DEFAULT nextval('road_type_id_seq'::regclass),
    value_ character varying(100) COLLATE pg_catalog."default",
    id_description integer NOT NULL,
    CONSTRAINT road_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.road_type
    OWNER to postgres;

/* tabla de screens */  

CREATE TABLE public.screen
(
    id integer NOT NULL DEFAULT nextval('screen_id_seq'::regclass),
    id_site integer NOT NULL,
    inches smallint,
    serial_number character varying(50) COLLATE pg_catalog."default",
    id_screen_brand integer NOT NULL,
    id_screen_model integer,
    resolution_width integer,
    resolution_heigth integer,
    screen_type integer NOT NULL,
    situation character varying(100) COLLATE pg_catalog."default",
    orientation integer,
    cabinets integer,
    CONSTRAINT screen_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.screen
    OWNER to postgres;

/* tabla de screen brands */  

CREATE TABLE public.screen_brand
(
    id integer NOT NULL DEFAULT nextval('screen_brand_id_seq'::regclass),
    description character varying(100) COLLATE pg_catalog."default" NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT scrren_brand_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.screen_brand
    OWNER to postgres;

COMMENT ON TABLE public.screen_brand
    IS 'Marcas de pantallas';

/* tabla de screen locations */  

CREATE TABLE public.screen_location
(
    id integer NOT NULL DEFAULT nextval('screen_location_id_seq'::regclass),
    description character varying(100) COLLATE pg_catalog."default",
    id_customer integer NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT screen_location_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.screen_location
    OWNER to postgres;

COMMENT ON TABLE public.screen_location
    IS 'Localizaciones de las pantallas dentro del local, lista por cliente';

/* tabla de screen models */  

CREATE TABLE public.screen_model
(
    id integer NOT NULL DEFAULT nextval('screen_model_id_seq'::regclass),
    description character varying(100) COLLATE pg_catalog."default" NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    id_screen_brand integer NOT NULL,
    screen_type integer,
    resolution_width integer,
    resolution_heigth integer,
    measure_width integer,
    measure_heigth integer,
    CONSTRAINT screen_model_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.screen_model
    OWNER to postgres;

COMMENT ON TABLE public.screen_model
    IS 'Modelos de pantallas';

/* tabla de screen types */  


CREATE TABLE public.screen_type
(
    id integer NOT NULL DEFAULT nextval('screen_type_id_seq'::regclass),
    value_ character varying(100) COLLATE pg_catalog."default",
    id_description integer NOT NULL,
    deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT screen_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.screen_type
    OWNER to postgres;

COMMENT ON TABLE public.screen_type
    IS 'Tipos de pantallas';

/* tabla de sites */  

CREATE TABLE public.site
(
    id integer NOT NULL DEFAULT nextval('site_id_seq'::regclass),
    id_site_comercial character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id_pti bigint NOT NULL,
    id_place integer NOT NULL,
    id_customer integer NOT NULL,
    id_net integer,
    entry_date timestamp with time zone NOT NULL,
    id_status integer,
    id_brand integer,
    public_ boolean,
    on_off boolean,
    deleted boolean NOT NULL DEFAULT false,
    text_ character varying(100) COLLATE pg_catalog."default",
    id_screen_location integer,
    CONSTRAINT site_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.site
    OWNER to postgres;

COMMENT ON TABLE public.site
    IS 'Pantallas instaladas. Emplazamientos';

/* tabla de sites circuits */  

CREATE TABLE public.site_circuit
(
    id integer NOT NULL DEFAULT nextval('site_circuit_id_seq'::regclass),
    id_site integer NOT NULL,
    id_circuit integer NOT NULL,
    CONSTRAINT site_circuit_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.site_circuit
    OWNER to postgres;

COMMENT ON TABLE public.site_circuit
    IS 'Relación entre pantallas y circuitos. Una pantalla puede estar en varios circuitos';

/* tabla de status */  

CREATE TABLE public.status
(
    id integer NOT NULL DEFAULT nextval('status_id_seq'::regclass),
    value_ character varying(100) COLLATE pg_catalog."default",
    id_description integer NOT NULL,
    order_ integer NOT NULL,
    default_ boolean,
    CONSTRAINT status_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.status
    OWNER to postgres;

COMMENT ON TABLE public.status
    IS 'Estados de las pantallas';

/* tabla de entities territorial */  

CREATE TABLE public.territorial_entities
(
    id integer NOT NULL DEFAULT nextval('territorial_entities_id_seq'::regclass),
    id_territorial_org integer NOT NULL,
    id_description integer NOT NULL,
    relation_id integer,
    CONSTRAINT territorial_entities_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.territorial_entities
    OWNER to postgres;

COMMENT ON TABLE public.territorial_entities
    IS 'Entidades territoriales';

/* tabla de organization territorial */  

CREATE TABLE public.territorial_organization
(
    id integer NOT NULL DEFAULT nextval('terriotorial_organization_id_seq'::regclass),
    id_country integer NOT NULL,
    id_description integer NOT NULL,
    hierarchy_ integer,
    value_ character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT terriotorial_organization_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.territorial_organization
    OWNER to postgres;

COMMENT ON TABLE public.territorial_organization
    IS 'Estructura organizativa de los paises';

/* tabla de users app */  

CREATE TABLE public.user_app
(
    id integer NOT NULL,
    id_customer integer,
    name character varying(30) COLLATE pg_catalog."default" NOT NULL,
    surname character varying(40) COLLATE pg_catalog."default",
    last_access date,
    notes character varying(200) COLLATE pg_catalog."default",
    deleted boolean NOT NULL DEFAULT false,
    id_languaje integer NOT NULL,
    start_date date,
    CONSTRAINT user_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.user_app
    OWNER to postgres;

COMMENT ON TABLE public.user_app
    IS 'Usuarios de la aplicacion';

COMMENT ON COLUMN public.user_app.id_languaje
    IS 'Idioma del usuario';

/* tabla de relacion usuarios clientes */  

CREATE TABLE public.user_customer
(
    id integer NOT NULL DEFAULT nextval('user_customer_id_seq'::regclass),
    id_user integer NOT NULL,
    id_customer integer NOT NULL,
    CONSTRAINT user_customer_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.user_customer
    OWNER to postgres;

COMMENT ON TABLE public.user_customer
    IS 'Pantallas que pueden gestionar usuarios de clientes que no son propietarios o
Pantallas que NO pueden gestionar usuarios de clientes que son propietarios ';

/* tabla de sites not accesible by users */  

CREATE TABLE public.user_no_site
(
    id integer NOT NULL DEFAULT nextval('user_no_site_id_seq'::regclass),
    id_user integer NOT NULL,
    id_site integer NOT NULL,
    CONSTRAINT user_no_site_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.user_no_site
    OWNER to postgres;

COMMENT ON TABLE public.user_no_site
    IS 'Pantallas que NO pueden gestionar usuarios de clientes propietarios o
 no ';

