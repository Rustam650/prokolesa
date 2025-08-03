"""
Base admin classes with protection against state leaking between requests.
Based on: https://adamj.eu/tech/2024/04/29/django-admin-prevent-leaking-requests/
"""
from functools import partial
from django.contrib import admin
from django.db.models.base import ModelBase


class ModelAdmin(admin.ModelAdmin):
    """
    Custom ModelAdmin that prevents attribute setting after registration
    to avoid state leaking between requests.
    """
    def __setattr__(self, name: str, value) -> None:
        """
        Prevent setting attributes post-registration to avoid state leaking.
        """
        if getattr(self, "_prevent_attr_setting", False):
            clsname = self.__class__.__qualname__
            raise AttributeError(
                f"Cannot set attribute {name!r} on {clsname} after "
                + "registration. If you are trying to store per-request "
                + "attributes, they will leak between requests. "
                + "Store state on the request object instead."
            )
        return super().__setattr__(name, value)


class AdminSite(admin.AdminSite):
    """
    Custom AdminSite that enforces use of our protected ModelAdmin.
    """
    def register(self, model_or_iterable, admin_class=None, **options):
        if admin_class is None:
            admin_class = ModelAdmin

        if not issubclass(admin_class, ModelAdmin):
            raise TypeError(f"Only subclasses of core.admin_base.ModelAdmin may be used.")

        super().register(model_or_iterable, admin_class, **options)

        # Prevent further attributes from being set on the ModelAdmin class
        if isinstance(model_or_iterable, ModelBase):
            model_or_iterable = [model_or_iterable]
        for model in model_or_iterable:
            if model in self._registry:
                self._registry[model]._prevent_attr_setting = True


# Create custom admin site instance
admin_site = AdminSite(name='prokolesa_admin')
register = partial(admin.register, site=admin_site) 