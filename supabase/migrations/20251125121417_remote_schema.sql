-- Bucket erzeugen
insert into storage.buckets (id, name, public)
values ('pdf-files', 'pdf-files', false)
    on conflict (id) do nothing;

