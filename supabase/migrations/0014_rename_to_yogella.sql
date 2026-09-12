-- App rebrand: Quiet Studio -> Yogella. Updates the column default for
-- future resets and fixes the existing row only if it still holds one of
-- the known pre-rebrand values, so a real admin customization is never
-- silently overwritten.
alter table public.membership_plan alter column title set default 'Abonnement Yogella';

update public.membership_plan
set title = 'Abonnement Yogella', updated_at = now()
where id = 1 and title in ('Abonnement Quiet Studio', 'Quiet Studio Premium');
