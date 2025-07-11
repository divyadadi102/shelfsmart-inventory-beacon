create database shelfsmart_db
    with owner postgres;

create sequence public.sales_id_seq
    as integer;

alter sequence public.sales_id_seq owner to postgres;

create sequence public.sales_id_seq1
    as integer;

alter sequence public.sales_id_seq1 owner to postgres;

create table public.users
(
    id              serial
        primary key,
    name            varchar(100) not null,
    email           varchar(200) not null
        unique,
    hashed_password varchar(255) not null,
    created_at      timestamp default CURRENT_TIMESTAMP
);

alter table public.users
    owner to postgres;

create table public.products
(
    id            serial
        primary key,
    name          varchar(200) not null
        unique,
    category      varchar(100),
    current_stock integer   default 0,
    status        varchar(20),
    last_updated  timestamp default CURRENT_TIMESTAMP
);

alter table public.products
    owner to postgres;

create table public.forecasts
(
    id             serial
        primary key,
    product_id     integer
        references public.products
            on delete cascade,
    forecast_date  date    not null,
    forecast_value integer not null,
    actual_value   integer,
    unique (product_id, forecast_date)
);

alter table public.forecasts
    owner to postgres;

create table public.uploads
(
    id         serial
        primary key,
    user_id    integer
                            references public.users
                                on delete set null,
    filename   varchar(255) not null,
    status     varchar(50) default 'pending'::character varying,
    row_count  integer,
    created_at timestamp   default CURRENT_TIMESTAMP
);

alter table public.uploads
    owner to postgres;

create table public.pos_connections
(
    id           serial
        primary key,
    user_id      integer
        references public.users
            on delete cascade,
    pos_url      varchar(255) not null,
    api_key      varchar(255) not null,
    connected_at timestamp default CURRENT_TIMESTAMP
);

alter table public.pos_connections
    owner to postgres;

create table public."user"
(
    id              serial
        primary key,
    name            varchar   not null,
    email           varchar   not null,
    hashed_password varchar   not null,
    created_at      timestamp not null
);

alter table public."user"
    owner to postgres;

create unique index ix_user_email
    on public."user" (email);

create table public.upload
(
    id         serial
        primary key,
    user_id    integer
        references public."user",
    filename   varchar   not null,
    status     varchar   not null,
    row_count  integer,
    created_at timestamp not null
);

alter table public.upload
    owner to postgres;

create table public.posconnection
(
    id           serial
        primary key,
    user_id      integer   not null
        references public."user",
    pos_url      varchar   not null,
    api_key      varchar   not null,
    connected_at timestamp not null
);

alter table public.posconnection
    owner to postgres;

create table public.walmart_sales
(
    id         integer default nextval('sales_id_seq'::regclass) not null
        constraint sales_pkey
            primary key,
    date       timestamp                                         not null,
    store_id   varchar(50)                                       not null,
    item_id    varchar(50)                                       not null,
    units_sold integer                                           not null,
    sell_price double precision,
    weekday    varchar(20),
    month      integer
);

alter table public.walmart_sales
    owner to postgres;

alter sequence public.sales_id_seq owned by public.walmart_sales.id;

create table public.csv_items
(
    item_nbr   integer,
    family     varchar(50),
    class      integer,
    perishable integer
);

alter table public.csv_items
    owner to postgres;

create table public.sales
(
    id          integer default nextval('sales_id_seq1'::regclass) not null
        constraint sales_pkey1
            primary key,
    date        date                                               not null,
    store_nbr   integer                                            not null,
    item_nbr    integer                                            not null,
    unit_sales  double precision,
    onpromotion boolean,
    category    varchar(64),
    holiday     integer,
    item_class  integer,
    perishable  integer,
    price       double precision,
    cost_price  numeric(10, 2),
    constraint unique_date_store_item
        unique (date, store_nbr, item_nbr)
);

alter table public.sales
    owner to postgres;

alter sequence public.sales_id_seq1 owned by public.sales.id;

create table public.product
(
    id              serial
        primary key,
    item_nbr        integer      not null
        unique,
    item_name       varchar(100) not null,
    item_category   varchar(64),
    item_perishable integer default 0,
    item_inventory  integer default 0
);

alter table public.product
    owner to postgres;

create table public.forecast
(
    id             serial
        primary key,
    product_id     integer   not null
        references public.product,
    forecast_date  timestamp not null,
    forecast_value integer   not null,
    actual_value   integer
);

alter table public.forecast
    owner to postgres;





INSERT INTO "user" (name, email, hashed_password, created_at)
VALUES (
  'Test User',
  'test@example.com',
  '$2b$12$tj4y2e04fLXlkgx7x/uvMe.wAJ.xijP7EJeXERzBF.0TM70STuRuK',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

