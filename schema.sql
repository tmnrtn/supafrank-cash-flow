-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.balance (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  balance_date date,
  balance_amount real,
  CONSTRAINT balance_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bill (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  supplier text,
  description text,
  amount real,
  due_date date,
  category bigint,
  CONSTRAINT bill_pkey PRIMARY KEY (id),
  CONSTRAINT bill_category_fkey FOREIGN KEY (category) REFERENCES public.category(id)
);
CREATE TABLE public.category (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.dim_date (
  date_key date NOT NULL,
  year integer,
  month integer,
  month_name text,
  quarter integer,
  day_of_week integer,
  day_name text,
  is_weekend boolean,
  CONSTRAINT dim_date_pkey PRIMARY KEY (date_key)
);
CREATE TABLE public.invoice (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  description text,
  amount real,
  client text,
  due_date date,
  CONSTRAINT invoice_pkey PRIMARY KEY (id)
);