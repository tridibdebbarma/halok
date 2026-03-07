-- Fix the RLS policy for the contacts table to allow anonymous users to submit the contact form
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;

CREATE POLICY "Anyone can insert contacts" 
ON public.contacts 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
