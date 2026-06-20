import { useTranslate } from "@global/localization";
import { StatusScreen } from "../StatusScreen";

const ErrorPage = () => {
  const { t } = useTranslate("misc");
  return (
    <StatusScreen
      code={t("error.code")}
      title={t("error.title")}
      subtitle={t("error.subtitle")}
      homeLabel={t("error.home")}
    />
  );
};

export default ErrorPage;
