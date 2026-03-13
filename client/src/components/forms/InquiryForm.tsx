import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { inquiryFormSchema } from "@shared/schema";
import type { z } from "zod";

type InquiryFormData = z.infer<typeof inquiryFormSchema>;

interface InquiryFormProps {
  tourId?: string;
  tourTitle?: string;
}

export function InquiryForm({ tourId, tourTitle }: InquiryFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      peopleCount: 2,
      hotel: "",
      message: "",
      tourId: tourId || undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: t("inquiry.success"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InquiryFormData) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">{t("inquiry.success")}</h3>
        <p className="text-muted-foreground">{t("inquiry.success")}</p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => {
              if (tourTitle) {
                const params = form.getValues();
                window.open(
                  `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hi, I submitted an inquiry for ${tourTitle}. ${params.date ? `Date: ${params.date}` : ''} ${params.peopleCount ? `People: ${params.peopleCount}` : ''}`
                  )}`,
                  "_blank"
                );
              }
            }}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A]"
          >
            {t("inquiry.whatsappCta")}
          </Button>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            {t("common.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {tourTitle && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Tour:</p>
            <p className="font-medium">{tourTitle}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inquiry.name")} *</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-inquiry-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inquiry.email")} *</FormLabel>
              <FormControl>
                <Input type="email" {...field} data-testid="input-inquiry-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inquiry.phone")}</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-inquiry-phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("inquiry.date")}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={new Date().toISOString().split('T')[0]}
                    data-testid="input-inquiry-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="peopleCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("inquiry.people")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    data-testid="input-inquiry-people"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hotel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inquiry.hotel")}</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-inquiry-hotel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inquiry.message")}</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} data-testid="input-inquiry-message" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
          data-testid="button-submit-inquiry"
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("inquiry.submit")}
        </Button>
      </form>
    </Form>
  );
}
