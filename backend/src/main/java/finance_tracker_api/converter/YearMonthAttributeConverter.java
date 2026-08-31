package finance_tracker_api.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.YearMonth;

@Converter(
        autoApply = true
)
public class YearMonthAttributeConverter
        implements AttributeConverter<
                YearMonth,
                String
        > {

    @Override
    public String convertToDatabaseColumn(
            YearMonth attribute
    ) {

        if (attribute == null) {
            return null;
        }

        return attribute.toString();
    }

    @Override
    public YearMonth convertToEntityAttribute(
            String dbData
    ) {

        if (dbData == null) {
            return null;
        }

        return YearMonth.parse(
                dbData
        );
    }
}
