import { useTranslate } from "@global/localization";
import { StatusScreen } from "../StatusScreen";

const NotFoundPage = () => {
  const { t } = useTranslate("misc");
  return (
    <StatusScreen
      code={t("notFound.code")}
      title={t("notFound.title")}
      subtitle={t("notFound.subtitle")}
      homeLabel={t("notFound.home")}
    />
  );
};

export default NotFoundPage;
