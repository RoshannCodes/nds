ALTER TABLE "attendance" DROP CONSTRAINT "attendance_staff_id_date_unique";--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "unique_staff_date" UNIQUE("staff_id","date");